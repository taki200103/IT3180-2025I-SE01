import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto, UpdateShiftDto } from './shift.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly service: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ca trực mới' })
  @ApiBody({ type: CreateShiftDto })
  create(@Body() data: CreateShiftDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ca trực' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Ngày bắt đầu (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Ngày kết thúc (YYYY-MM-DD)' })
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.service.findAll(startDate, endDate);
  }

  @Get('guard')
  @ApiOperation({ summary: 'Lấy danh sách bảo vệ' })
  getGuardList() {
    return this.service.getGuardList();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin ca trực' })
  @ApiParam({ name: 'id', description: 'ID của ca trực' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật ca trực' })
  @ApiParam({ name: 'id', description: 'ID của ca trực' })
  @ApiBody({ type: UpdateShiftDto })
  update(@Param('id') id: string, @Body() data: UpdateShiftDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ca trực' })
  @ApiParam({ name: 'id', description: 'ID của ca trực' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

