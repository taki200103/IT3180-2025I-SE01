import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplainDto, UpdateComplainDto } from './complain.dto';

@Injectable()
export class ComplainService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateComplainDto) {
    return this.prisma.complain.create({
      data: {
        residentId: data.residentId,
        title: data.title,
        message: data.message,
        responseText: data.responseText,
        status: data.status || 'pending',
        targetRole: data.targetRole || 'admin',
      },
      include: { resident: true },
    });
  }

  findAll() {
    return this.prisma.complain.findMany({
      include: { resident: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByResident(residentId: string) {
    return this.prisma.complain.findMany({
      where: { residentId },
      include: { resident: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.complain.findUnique({
      where: { id },
      include: { resident: true },
    });
  }

  update(id: string, data: UpdateComplainDto) {
    return this.prisma.complain.update({
      where: { id },
      data,
      include: { resident: true },
    });
  }

  remove(id: string) {
    return this.prisma.complain.delete({ where: { id } });
  }
}
