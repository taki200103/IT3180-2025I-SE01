import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum ShiftType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
}

export class CreateShiftDto {
  @ApiProperty({ description: 'Ngày trực', example: '2024-12-01' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Loại ca trực', enum: ShiftType, example: 'morning' })
  @IsEnum(ShiftType)
  @IsNotEmpty()
  shiftType: ShiftType;

  @ApiProperty({ description: 'ID của bảo vệ' })
  @IsString()
  @IsNotEmpty()
  policeId: string;
}

export class UpdateShiftDto {
  @ApiProperty({ description: 'Ngày trực', required: false, example: '2024-12-01' })
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Loại ca trực', enum: ShiftType, required: false, example: 'morning' })
  @IsEnum(ShiftType)
  shiftType?: ShiftType;

  @ApiProperty({ description: 'ID của bảo vệ', required: false })
  @IsString()
  policeId?: string;
}

export class ShiftResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: ShiftType })
  shiftType: string;

  @ApiProperty()
  policeId: string;

  @ApiProperty()
  police?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

