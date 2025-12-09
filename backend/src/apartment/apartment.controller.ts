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
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto, UpdateApartmentDto } from './apartment.dto';
// import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private readonly service: ApartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new apartment' })
  @ApiBody({ type: CreateApartmentDto })
  create(@Body() data: CreateApartmentDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all apartments' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get apartment by ID' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update apartment' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiBody({ type: UpdateApartmentDto })
  update(@Param('id') id: string, @Body() data: UpdateApartmentDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete apartment' })
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
