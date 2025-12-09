import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApartmentDto, UpdateApartmentDto } from './apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateApartmentDto) {
    return this.prisma.apartment.create({
      data: {
        name: data.name,
        contractStartDate: new Date(data.contractStartDate),
        contractEndDate: new Date(data.contractEndDate),
        ownerId: data.ownerId,
        area: data.area,
      },
      include: { residents: true },
    });
  }

  findAll() {
    return this.prisma.apartment.findMany({
      include: { residents: true },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.apartment.findUnique({
      where: { id },
      include: { residents: true },
    });
  }

  update(id: string, data: UpdateApartmentDto) {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.contractStartDate !== undefined) {
      updateData.contractStartDate = new Date(data.contractStartDate);
    }
    if (data.contractEndDate !== undefined) {
      updateData.contractEndDate = new Date(data.contractEndDate);
    }
    if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;
    if (data.area !== undefined) updateData.area = data.area;

    return this.prisma.apartment.update({
      where: { id },
      data: updateData,
      include: { residents: true },
    });
  }

  remove(id: string) {
    return this.prisma.apartment.delete({ where: { id } });
  }
}
