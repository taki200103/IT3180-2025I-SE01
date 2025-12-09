import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: { info: string; creator: string; residentIds?: string[] }) {
    // Tạo notification
    const notification = await this.prisma.notification.create({
      data: {
        info: data.info,
        creator: data.creator,
      },
    });

    // Nếu có residentIds, chỉ gửi cho những cư dân đó
    // Nếu không có, gửi cho tất cả cư dân
    let targetResidents: { id: string }[];
    
    if (data.residentIds && data.residentIds.length > 0) {
      // Chỉ gửi cho các cư dân được chọn
      targetResidents = await this.prisma.resident.findMany({
        where: {
          id: { in: data.residentIds },
        },
        select: { id: true },
      });
    } else {
      // Gửi cho tất cả cư dân
      targetResidents = await this.prisma.resident.findMany({
        select: { id: true },
      });
    }

    // Tạo liên kết giữa notification và residents
    if (targetResidents.length > 0) {
      await this.prisma.residentNotification.createMany({
        data: targetResidents.map((resident) => ({
          notificationId: notification.id,
          residentId: resident.id,
        })),
        skipDuplicates: true,
      });
    }

    return this.prisma.notification.findUnique({
      where: { id: notification.id },
      include: { residents: true },
    });
  }

  findAll() {
    return this.prisma.notification.findMany({
      include: { residents: true },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
      include: { residents: true },
    });
  }

  update(id: string, data: { info?: string; creator?: string }) {
    return this.prisma.notification.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
