import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Phí thuê',
    description:
      'Tên loại phí (Phí thuê, Phí điện, Phí nước, Phí gửi xe, Phí vệ sinh, Phí dịch vụ, Phí nhà ở)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '2024-11', description: 'Tháng (YYYY-MM)' })
  @IsString()
  @IsNotEmpty()
  month: string;

  @ApiProperty({ example: 3000000, description: 'Số tiền của loại phí này' })
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
}

export class UpdateServiceDto {
  @ApiProperty({
    example: 'Phí thuê',
    description: 'Tên loại phí',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '2024-11',
    description: 'Tháng (YYYY-MM)',
    required: false,
  })
  @IsString()
  @IsOptional()
  month?: string;

  @ApiProperty({
    example: 3000000,
    description: 'Số tiền của loại phí này',
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
}
