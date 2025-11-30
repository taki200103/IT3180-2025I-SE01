import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Thông báo bảo trì thang máy' })
  @IsString()
  @IsNotEmpty()
  info: string;

  @ApiProperty({ example: 'Ban quản lý' })
  @IsString()
  @IsNotEmpty()
  creator: string;
}

export class UpdateNotificationDto {
  @ApiProperty({ example: 'Thông báo bảo trì thang máy', required: false })
  @IsString()
  info?: string;

  @ApiProperty({ example: 'Ban quản lý', required: false })
  @IsString()
  creator?: string;
}
