import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Thông báo bảo trì thang máy' })
  @IsString()
  @IsNotEmpty()
  info: string;

  @ApiProperty({ example: 'Ban quản lý' })
  @IsString()
  @IsNotEmpty()
  creator: string;

  @ApiProperty({
    example: ['resident-id-1', 'resident-id-2'],
    required: false,
    description: 'Danh sách ID cư dân. Nếu không có, sẽ gửi cho tất cả cư dân',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  residentIds?: string[];
}

export class UpdateNotificationDto {
  @ApiProperty({ example: 'Thông báo bảo trì thang máy', required: false })
  @IsString()
  info?: string;

  @ApiProperty({ example: 'Ban quản lý', required: false })
  @IsString()
  creator?: string;
}
