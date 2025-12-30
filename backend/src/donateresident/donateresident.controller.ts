// src/donateresident/donateresident.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DonateresidentService } from './donateresident.service';
import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';
import {
  CreateDonateResidentDto,
  UpdateDonateResidentDto,
  DonateResidentResponseDto,
} from './donateresident.dto';

@ApiTags('DonateResidents')
@UseGuards(JwtAuthGuard)
@Controller('donate-residents')
export class DonateresidentController {
  constructor(
    private readonly donateresidentService: DonateresidentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quan hệ donate-resident mới' })
  @ApiResponse({
    status: 201,
    description: 'Quan hệ đã được tạo thành công',
    type: DonateResidentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Donate hoặc Resident không tồn tại',
  })
  @ApiResponse({
    status: 400,
    description: 'Quan hệ đã tồn tại',
  })
  create(
    @Body() createDonateResidentDto: CreateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    return this.donateresidentService.create(createDonateResidentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả quan hệ donate-resident' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tất cả quan hệ',
    type: [DonateResidentResponseDto],
  })
  findAll(): Promise<DonateResidentResponseDto[]> {
    return this.donateresidentService.findAll();
  }

  @Get('donate/:donateId')
  @ApiOperation({ summary: 'Lấy tất cả quan hệ theo Donate ID' })
  @ApiParam({ name: 'donateId', description: 'ID của quyên góp' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách quan hệ của quyên góp',
    type: [DonateResidentResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Donate không tồn tại' })
  getAllByDonateId(
    @Param('donateId') donateId: string,
  ): Promise<DonateResidentResponseDto[]> {
    return this.donateresidentService.getAllByDonateId(donateId);
  }

  @Get('resident/:residentId')
  @ApiOperation({ summary: 'Lấy tất cả quan hệ theo Resident ID' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách quan hệ của cư dân',
    type: [DonateResidentResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Resident không tồn tại' })
  getAllByResidentId(
    @Param('residentId') residentId: string,
  ): Promise<DonateResidentResponseDto[]> {
    return this.donateresidentService.getAllByResidentId(residentId);
  }

  @Get(':donateId/:residentId')
  @ApiOperation({ summary: 'Lấy chi tiết một quan hệ donate-resident' })
  @ApiParam({ name: 'donateId', description: 'ID của quyên góp' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết quan hệ',
    type: DonateResidentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quan hệ không tồn tại' })
  findOne(
    @Param('donateId') donateId: string,
    @Param('residentId') residentId: string,
  ): Promise<DonateResidentResponseDto> {
    return this.donateresidentService.findOne(donateId, residentId);
  }

  @Patch(':donateId/:residentId')
  @ApiOperation({ summary: 'Cập nhật quan hệ donate-resident' })
  @ApiParam({ name: 'donateId', description: 'ID của quyên góp' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({
    status: 200,
    description: 'Quan hệ đã được cập nhật',
    type: DonateResidentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quan hệ không tồn tại' })
  update(
    @Param('donateId') donateId: string,
    @Param('residentId') residentId: string,
    @Body() updateDonateResidentDto: UpdateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    return this.donateresidentService.update(
      donateId,
      residentId,
      updateDonateResidentDto,
    );
  }

  @Delete(':donateId/:residentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa quan hệ donate-resident' })
  @ApiParam({ name: 'donateId', description: 'ID của quyên góp' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({ status: 200, description: 'Quan hệ đã được xóa' })
  @ApiResponse({ status: 404, description: 'Quan hệ không tồn tại' })
  remove(
    @Param('donateId') donateId: string,
    @Param('residentId') residentId: string,
  ): Promise<{ message: string }> {
    return this.donateresidentService.remove(donateId, residentId);
  }
}
