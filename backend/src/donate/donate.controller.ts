// src/donate/donate.controller.ts
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
import { DonateService } from './donate.service';
import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';
import {
  CreateDonateDto,
  UpdateDonateDto,
  DonateResponseDto,
  AddResidentToDonateDto,
  UpdateDonateResidentDto,
  DonateResidentResponseDto,
} from './donate.dto';

@ApiTags('Donates')
@UseGuards(JwtAuthGuard)
@Controller('donates')
export class DonateController {
  constructor(private readonly donateService: DonateService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quyên góp mới' })
  @ApiResponse({
    status: 201,
    description: 'Quyên góp đã được tạo thành công',
    type: DonateResponseDto,
  })
  create(@Body() createDonateDto: CreateDonateDto): Promise<DonateResponseDto> {
    return this.donateService.create(createDonateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả quyên góp' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tất cả quyên góp',
    type: [DonateResponseDto],
  })
  findAll(): Promise<DonateResponseDto[]> {
    return this.donateService.findAll();
  }

  @Get('resident/:residentId')
  @ApiOperation({ summary: 'Lấy tất cả quyên góp theo Resident ID' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách quyên góp của cư dân',
    type: [DonateResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Resident không tồn tại' })
  getAllByResidentId(
    @Param('residentId') residentId: string,
  ): Promise<DonateResponseDto[]> {
    return this.donateService.getAllByResidentId(residentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết quyên góp',
    type: DonateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quyên góp không tồn tại' })
  findOne(@Param('id') id: string): Promise<DonateResponseDto> {
    return this.donateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiResponse({
    status: 200,
    description: 'Quyên góp đã được cập nhật',
    type: DonateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quyên góp không tồn tại' })
  update(
    @Param('id') id: string,
    @Body() updateDonateDto: UpdateDonateDto,
  ): Promise<DonateResponseDto> {
    return this.donateService.update(id, updateDonateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiResponse({ status: 200, description: 'Quyên góp đã được xóa' })
  @ApiResponse({ status: 404, description: 'Quyên góp không tồn tại' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.donateService.remove(id);
  }

  // Endpoints cho quản lý cư dân trong quyên góp
  @Post(':id/residents')
  @ApiOperation({ summary: 'Thêm cư dân vào quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiResponse({
    status: 201,
    description: 'Cư dân đã được thêm vào quyên góp',
    type: DonateResidentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quyên góp hoặc cư dân không tồn tại' })
  addResident(
    @Param('id') donateId: string,
    @Body() addResidentDto: AddResidentToDonateDto,
  ): Promise<DonateResidentResponseDto> {
    return this.donateService.addResident(donateId, addResidentDto);
  }

  @Delete(':id/residents/:residentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa cư dân khỏi quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({ status: 200, description: 'Cư dân đã được xóa khỏi quyên góp' })
  @ApiResponse({ status: 404, description: 'Quan hệ không tồn tại' })
  removeResident(
    @Param('id') donateId: string,
    @Param('residentId') residentId: string,
  ): Promise<{ message: string }> {
    return this.donateService.removeResident(donateId, residentId);
  }

  @Patch(':id/residents/:residentId/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái của cư dân trong quyên góp' })
  @ApiParam({ name: 'id', description: 'ID của quyên góp' })
  @ApiParam({ name: 'residentId', description: 'ID của cư dân' })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái đã được cập nhật',
    type: DonateResidentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Quan hệ không tồn tại' })
  updateResidentStatus(
    @Param('id') donateId: string,
    @Param('residentId') residentId: string,
    @Body() updateDto: UpdateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    return this.donateService.updateResidentStatus(
      donateId,
      residentId,
      updateDto,
    );
  }
}
