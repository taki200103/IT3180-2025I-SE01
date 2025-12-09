import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';

@ApiTags('Services')
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create new service' })
  @ApiBody({ type: CreateServiceDto })
  create(@Body() data: CreateServiceDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(parseInt(id, 10));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiBody({ type: UpdateServiceDto })
  update(@Param('id') id: string, @Body() data: UpdateServiceDto) {
    return this.service.update(parseInt(id, 10), data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(parseInt(id, 10));
  }
}
