// resident-notification.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResidentnotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotificationsByResident(residentId: string) {
    return this.prisma.residentNotification.findMany({
      where: { residentId },
      include: {
        notification: true,
      },
    });
  }

  async getResidentsByNotification(notificationId: string) {
    return this.prisma.residentNotification.findMany({
      where: { notificationId },
      include: {
        resident: true,
      },
    });
  }
}
