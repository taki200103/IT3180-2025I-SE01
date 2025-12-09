// resident-notification.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResidentnotificationService } from './residentnotification.service';
import {
  GetNotificationsByResidentDto,
  GetResidentsByNotificationDto,
} from './residentnotification.dto';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';

@ApiTags('Resident Notifications')
// @UseGuards(JwtAuthGuard)
@Controller('resident-notifications')
export class ResidentnotificationController {
  constructor(private service: ResidentnotificationService) {}

  @Get('by-resident')
  @ApiOperation({ summary: 'Lấy thông báo theo ID resident' })
  getNotificationsByResident(
    @Query() dto: GetNotificationsByResidentDto,
  ): Promise<
    Prisma.ResidentNotificationGetPayload<{
      include: { notification: true };
    }>[]
  > {
    return this.service.getNotificationsByResident(dto.residentId);
  }

  @Get('by-notification')
  @ApiOperation({ summary: 'Lấy danh sách resident theo ID thông báo' })
  getResidentsByNotification(
    @Query() dto: GetResidentsByNotificationDto,
  ): Promise<
    Prisma.ResidentNotificationGetPayload<{
      include: { resident: true };
    }>[]
  > {
    return this.service.getResidentsByNotification(dto.notificationId);
  }
}
