import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateServiceDto) {
    return this.prisma.service.create({
      data,
      include: {
        invoices: true,
      },
    });
  }

  findAll() {
    return this.prisma.service.findMany({
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        invoices: true,
      },
    });
  }

  update(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data,
      include: {
        invoices: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.service.delete({ where: { id } });
  }
}
