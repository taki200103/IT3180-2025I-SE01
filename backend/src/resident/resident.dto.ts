import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateResidentDto {
  @ApiProperty({ example: 'uuid-apartment-id' })
  @IsString()
  @IsNotEmpty()
  apartmentId: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'email@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'resident', required: false })
  @IsString()
  role?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  temporaryStatus: boolean;

  @ApiProperty({ example: '001234567890' })
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;
}

export class UpdateResidentDto {
  @ApiProperty({ example: 'uuid-apartment-id', required: false })
  @IsString()
  apartmentId?: string;

  @ApiProperty({ example: 'Nguyen Van A', required: false })
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  password?: string;

  @ApiProperty({ example: 'email@example.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'resident', required: false })
  @IsString()
  role?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  temporaryStatus?: boolean;

  @ApiProperty({ example: '001234567890', required: false })
  @IsString()
  idNumber?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsDateString()
  birthDate?: string;
}
