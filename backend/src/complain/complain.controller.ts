import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ComplainService } from './complain.service';
import { CreateComplainDto, UpdateComplainDto } from './complain.dto';
import { JwtAuthGuard } from '../system/guards/jwt-auth.guard';

@ApiTags('Complains')
@UseGuards(JwtAuthGuard)
@Controller('complains')
export class ComplainController {
  constructor(private readonly service: ComplainService) {}

  @Post()
  @ApiOperation({ summary: 'Create new complaint' })
  @ApiBody({ type: CreateComplainDto })
  create(@Body() data: CreateComplainDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all complaints' })
  @ApiQuery({
    name: 'residentId',
    required: false,
    description: 'Filter by resident ID',
  })
  findAll(@Query('residentId') residentId?: string) {
    if (residentId) {
      return this.service.findByResident(residentId);
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complaint by ID' })
  @ApiParam({ name: 'id', description: 'Complaint ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update complaint (e.g., add response)' })
  @ApiParam({ name: 'id', description: 'Complaint ID' })
  @ApiBody({ type: UpdateComplainDto })
  update(@Param('id') id: string, @Body() data: UpdateComplainDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete complaint' })
  @ApiParam({ name: 'id', description: 'Complaint ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
