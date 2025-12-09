import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateComplainDto {
  @ApiProperty({
    description: 'ID of the resident making the complaint',
    example: 'uuid-here',
  })
  @IsString()
  @IsNotEmpty()
  residentId: string;

  @ApiProperty({
    description: 'Title of the complaint',
    example: 'Vấn đề về hệ thống nước',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Message content of the complaint',
    example: 'Nước bị tắc nghẽn ở tầng 3',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Initial response from admin (optional)',
    example: 'Đã ghi nhận yêu cầu',
    required: false,
  })
  @IsString()
  @IsOptional()
  responseText?: string;

  @ApiProperty({
    description: 'Status of the complaint',
    example: 'pending',
    required: false,
    default: 'pending',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Target role that should receive/handle this complaint',
    example: 'admin',
    required: false,
    default: 'admin',
  })
  @IsString()
  @IsOptional()
  targetRole?: string;
}

export class UpdateComplainDto {
  @ApiProperty({
    description: 'Title of the complaint',
    example: 'Vấn đề về hệ thống nước',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Message content of the complaint',
    example: 'Nước bị tắc nghẽn ở tầng 3',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Response text from admin',
    example: 'Đã xử lý xong',
    required: false,
  })
  @IsString()
  @IsOptional()
  responseText?: string;

  @ApiProperty({
    description: 'Status of the complaint',
    example: 'resolved',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Target role that should receive/handle this complaint',
    example: 'admin',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetRole?: string;
}
