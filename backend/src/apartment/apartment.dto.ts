import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateApartmentDto {
  @ApiProperty({
    description: 'Name of the apartment',
    example: 'A101',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  contractStartDate: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2025-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  contractEndDate: string;

  @ApiProperty({
    description: 'Owner ID',
    example: 'uuid-here',
  })
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({
    description: 'Area of the apartment in square meters',
    example: 50.5,
  })
  @IsNumber()
  @IsNotEmpty()
  area: number;
}

export class UpdateApartmentDto {
  @ApiProperty({
    description: 'Name of the apartment',
    example: 'A101',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Contract start date',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  contractStartDate?: string;

  @ApiProperty({
    description: 'Contract end date',
    example: '2025-12-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  contractEndDate?: string;

  @ApiProperty({
    description: 'Owner ID',
    example: 'uuid-here',
    required: false,
  })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @ApiProperty({
    description: 'Area of the apartment in square meters',
    example: 50.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  area?: number;
}
