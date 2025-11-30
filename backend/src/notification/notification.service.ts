import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  create(data: { info: string; creator: string }) {
    return this.prisma.notification.create({ data });
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
