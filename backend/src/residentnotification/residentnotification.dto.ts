// resident-notification.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetNotificationsByResidentDto {
  @ApiProperty({ example: 'uuid-resident-id' })
  @IsString()
  @IsNotEmpty()
  residentId: string;
}

export class GetResidentsByNotificationDto {
  @ApiProperty({ example: 'uuid-notification-id' })
  @IsString()
  @IsNotEmpty()
  notificationId: string;
}
