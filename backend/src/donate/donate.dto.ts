// src/donate/donate.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';

// DTO để tạo quyên góp mới
export class CreateDonateDto {
  @ApiProperty({ example: 1000000, description: 'Số tiền quyên góp' })
  @IsNumber()
  @IsNotEmpty()
  money: number;

  @ApiProperty({ example: 'Quyên góp từ thiện', description: 'Tên quyên góp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Quyên góp cho người nghèo',
    description: 'Mô tả quyên góp',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['resident-id-1', 'resident-id-2'],
    description: 'Danh sách ID cư dân tham gia quyên góp',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  residentIds?: string[];
}

// DTO để cập nhật quyên góp
export class UpdateDonateDto extends PartialType(CreateDonateDto) {}

// DTO response trả về
export class DonateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  money: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  residents?: DonateResidentResponseDto[];
}

// DTO để thêm cư dân vào quyên góp
export class AddResidentToDonateDto {
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

// DTO để cập nhật trạng thái của cư dân trong quyên góp
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

// DTO response cho donate-resident
export class DonateResidentResponseDto {
  @ApiProperty()
  donateId: string;

  @ApiProperty()
  residentId: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  donate?: DonateResponseDto;

  @ApiProperty({ required: false })
  resident?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}

