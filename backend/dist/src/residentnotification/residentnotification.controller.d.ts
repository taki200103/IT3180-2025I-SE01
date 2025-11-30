import { Prisma } from '@prisma/client';
import { ResidentnotificationService } from './residentnotification.service';
import { GetNotificationsByResidentDto, GetResidentsByNotificationDto } from './residentnotification.dto';
export declare class ResidentnotificationController {
    private service;
    constructor(service: ResidentnotificationService);
    getNotificationsByResident(dto: GetNotificationsByResidentDto): Promise<Prisma.ResidentNotificationGetPayload<{
        include: {
            notification: true;
        };
    }>[]>;
    getResidentsByNotification(dto: GetResidentsByNotificationDto): Promise<Prisma.ResidentNotificationGetPayload<{
        include: {
            resident: true;
        };
    }>[]>;
}
