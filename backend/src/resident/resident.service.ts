import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResidentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateResidentDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.resident.create({
      data: {
        apartmentId: data.apartmentId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        role: data.role ?? 'resident',
        temporaryStatus: data.temporaryStatus ?? false,
        idNumber: data.idNumber,
        birthDate: new Date(data.birthDate),
      },
      include: {
        apartment: true,
        notifications: true,
        invoices: true,
        complains: true,
      },
    });
  }

  findAll() {
    return this.prisma.resident.findMany({
      include: {
        apartment: true,
        notifications: true,
        invoices: true,
        complains: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.resident.findUnique({
      where: { id },
      include: {
        apartment: true,
        notifications: true,
        invoices: true,
        complains: true,
      },
    });
  }

  async update(id: string, data: UpdateResidentDto) {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }

    return this.prisma.resident.update({
      where: { id },
      data: updateData,
      include: {
        apartment: true,
        notifications: true,
        invoices: true,
        complains: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.resident.delete({ where: { id } });
  }
}
