// src/donateresident/donateresident.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO để tạo quan hệ donate-resident
export class CreateDonateResidentDto {
  @ApiProperty({ example: 'donate-id', description: 'ID của quyên góp' })
  @IsString()
  @IsNotEmpty()
  donateId: string;

  @ApiProperty({ example: 'resident-id', description: 'ID của cư dân' })
  @IsString()
  @IsNotEmpty()
  residentId: string;

  @ApiProperty({
    example: 'pending',
    description: 'Trạng thái',
    required: false,
    default: 'pending',
  })
  @IsString()
  @IsOptional()
  status?: string;
}

// DTO để cập nhật quan hệ donate-resident
export class UpdateDonateResidentDto {
  @ApiProperty({
    example: 'approved',
    description: 'Trạng thái mới',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
}

// DTO response trả về
export class DonateResidentResponseDto {
  @ApiProperty()
  donateId: string;

  @ApiProperty()
  residentId: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  donate?: {
    id: string;
    money: number;
    name: string;
    description?: string;
    createdAt: Date;
  };

  @ApiProperty({ required: false })
  resident?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}

