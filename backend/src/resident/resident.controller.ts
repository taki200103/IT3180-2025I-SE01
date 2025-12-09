import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  // UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { ResidentService } from './resident.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
// import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';

@ApiTags('Residents')
@Controller('residents')
export class ResidentController {
  constructor(private readonly service: ResidentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new resident' })
  @ApiBody({ type: CreateResidentDto })
  create(@Body() data: CreateResidentDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all residents' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resident by ID' })
  @ApiParam({ name: 'id', description: 'Resident ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resident' })
  @ApiParam({ name: 'id', description: 'Resident ID' })
  @ApiBody({ type: UpdateResidentDto })
  update(@Param('id') id: string, @Body() data: UpdateResidentDto) {
    return this.service.update(id, data);
  }

  @Put(':id/approve')
  @ApiOperation({ summary: 'Duyệt tài khoản cư dân' })
  @ApiParam({ name: 'id', description: 'Resident ID' })
  approve(@Param('id') id: string) {
    return this.service.approve(id);
  }

  @Put(':id/toggle-status')
  @ApiOperation({ summary: 'Đổi trạng thái cư dân (hoạt động/tạm vắng)' })
  @ApiParam({ name: 'id', description: 'Resident ID' })
  toggleTemporaryStatus(@Param('id') id: string) {
    return this.service.toggleTemporaryStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete resident' })
  @ApiParam({ name: 'id', description: 'Resident ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
