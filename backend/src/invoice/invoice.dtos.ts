// src/invoice/dto/invoice.dto.ts
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// DTO để tạo hóa đơn mới
export class CreateInvoiceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsString()
  @IsNotEmpty()
  residentId: string;

  @ApiProperty({ example: 'Phí quản lý tháng 10/2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 500000, required: false })
  @IsNumber()
  @IsOptional()
  money?: number;

  @ApiProperty({ example: 150, description: 'Số kWh điện (chỉ dùng cho Phí điện)', required: false })
  @IsNumber()
  @IsOptional()
  kWh?: number;

  @ApiProperty({ example: 10, description: 'Số m³ nước (chỉ dùng cho Phí nước)', required: false })
  @IsNumber()
  @IsOptional()
  waterM3?: number;
}

// DTO để cập nhật hóa đơn
export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

// DTO response trả về
export class InvoiceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  serviceId: number;

  @ApiProperty()
  residentId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  money: number;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  service?: {
    id: number;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({ required: false })
  resident?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}
