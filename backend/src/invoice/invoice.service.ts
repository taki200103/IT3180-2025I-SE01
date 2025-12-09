// src/invoice/invoice.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from './invoice.dtos';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    // Kiểm tra service tồn tại
    const service = await this.prisma.service.findUnique({
      where: { id: createInvoiceDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(
        `Service with ID ${createInvoiceDto.serviceId} not found`,
      );
    }

    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: createInvoiceDto.residentId },
    });
    if (!resident) {
      throw new NotFoundException(
        `Resident with ID ${createInvoiceDto.residentId} not found`,
      );
    }

    const invoice = await this.prisma.invoice.create({
      data: createInvoiceDto,
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return invoice;
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    return this.prisma.invoice.findMany({
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllByResidentId(residentId: string): Promise<InvoiceResponseDto[]> {
    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${residentId} not found`);
    }

    const invoices = await this.prisma.invoice.findMany({
      where: {
        residentId: residentId,
      },
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invoices;
  }

  async getAllByServiceId(serviceId: number): Promise<InvoiceResponseDto[]> {
    // Kiểm tra service tồn tại
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    const invoices = await this.prisma.invoice.findMany({
      where: {
        serviceId: serviceId,
      },
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invoices;
  }

  async findOne(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    await this.findOne(id);

    const invoice = await this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
      include: {
        service: true,
        resident: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return invoice;
  }

  async remove(id: string): Promise<{ message: string }> {
    // Kiểm tra invoice tồn tại
    await this.findOne(id);

    await this.prisma.invoice.delete({
      where: { id },
    });

    return { message: `Invoice with ID ${id} has been deleted successfully` };
  }

  async payInvoice(id: string): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    const invoice = await this.findOne(id);

    // Đánh dấu riêng hóa đơn này sang trạng thái 'pending' (chờ duyệt)
    await this.prisma.invoice.update({
      where: { id },
      data: { status: 'pending' },
    });

    // Lấy lại invoice đã cập nhật
    return this.findOne(id);
  }

  async approveInvoice(id: string): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    const invoice = await this.findOne(id);

    // Đánh dấu riêng hóa đơn này là 'paid' (đã duyệt)
    await this.prisma.invoice.update({
      where: { id },
      data: { status: 'paid' },
    });

    // Lấy lại invoice đã cập nhật
    return this.findOne(id);
  }

  async rejectInvoice(id: string): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    const invoice = await this.findOne(id);

    // Đánh dấu riêng hóa đơn này là 'unpaid' (từ chối)
    await this.prisma.invoice.update({
      where: { id },
      data: { status: 'unpaid' },
    });

    // Lấy lại invoice đã cập nhật
    return this.findOne(id);
  }
}
