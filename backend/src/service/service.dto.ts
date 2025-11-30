import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: '2024-10', description: 'Tháng (YYYY-MM)' })
  @IsString()
  @IsNotEmpty()
  month: string;

  @ApiProperty({ example: 5000000, description: 'Tổng số tiền' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({
    example: 'unpaid',
    description: 'Trạng thái: paid hoặc unpaid',
  })
  @IsString()
  @IsIn(['paid', 'unpaid'])
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 2000000, description: 'Phí thuê', required: false })
  @IsNumber()
  @IsOptional()
  rentAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí dịch vụ', required: false })
  @IsNumber()
  @IsOptional()
  serviceAmount?: number;

  @ApiProperty({ example: 300000, description: 'Phí vệ sinh', required: false })
  @IsNumber()
  @IsOptional()
  sanitationAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí gửi xe', required: false })
  @IsNumber()
  @IsOptional()
  parkingAmount?: number;

  @ApiProperty({ example: 1000000, description: 'Phí điện', required: false })
  @IsNumber()
  @IsOptional()
  electricityAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí nước', required: false })
  @IsNumber()
  @IsOptional()
  waterAmount?: number;

  @ApiProperty({ example: 200000, description: 'Phí nhà ở', required: false })
  @IsNumber()
  @IsOptional()
  housingAmount?: number;
}

export class UpdateServiceDto {
  @ApiProperty({
    example: '2024-10',
    description: 'Tháng (YYYY-MM)',
    required: false,
  })
  @IsString()
  @IsOptional()
  month?: string;

  @ApiProperty({
    example: 5000000,
    description: 'Tổng số tiền',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({
    example: 'paid',
    description: 'Trạng thái: paid hoặc unpaid',
    required: false,
  })
  @IsString()
  @IsIn(['paid', 'unpaid'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 2000000, description: 'Phí thuê', required: false })
  @IsNumber()
  @IsOptional()
  rentAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí dịch vụ', required: false })
  @IsNumber()
  @IsOptional()
  serviceAmount?: number;

  @ApiProperty({ example: 300000, description: 'Phí vệ sinh', required: false })
  @IsNumber()
  @IsOptional()
  sanitationAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí gửi xe', required: false })
  @IsNumber()
  @IsOptional()
  parkingAmount?: number;

  @ApiProperty({ example: 1000000, description: 'Phí điện', required: false })
  @IsNumber()
  @IsOptional()
  electricityAmount?: number;

  @ApiProperty({ example: 500000, description: 'Phí nước', required: false })
  @IsNumber()
  @IsOptional()
  waterAmount?: number;

  @ApiProperty({ example: 200000, description: 'Phí nhà ở', required: false })
  @IsNumber()
  @IsOptional()
  housingAmount?: number;
}
