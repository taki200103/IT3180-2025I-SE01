import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsDateString,
  ValidateIf,
  IsOptional,
  Matches,
} from 'class-validator';

type RoleAware = { role?: string };
const requiresApartment = (data: RoleAware) =>
  (data.role ?? 'resident').toLowerCase() === 'resident';

export class CreateResidentDto {
  @ApiProperty({
    example: 'uuid-apartment-id',
    required: false,
    description: 'Required when role is resident',
  })
  @ValidateIf(requiresApartment)
  @IsString()
  @IsNotEmpty()
  apartmentId?: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Họ tên không hợp lệ',
  })
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

  @ApiProperty({
    example: 'resident',
    required: false,
    description: 'Supported roles: resident | admin | police | accountant',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  temporaryStatus?: boolean;

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
  @IsOptional()
  @IsString()
  apartmentId?: string;

  @ApiProperty({ example: 'Nguyen Van A', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'email@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'resident', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  temporaryStatus?: boolean;

  @ApiProperty({ example: '001234567890', required: false })
  @IsOptional()
  @IsString()
  idNumber?: string;

  @ApiProperty({ example: '1990-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
