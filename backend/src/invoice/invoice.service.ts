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

    // Đảm bảo cột status tồn tại
    await this.ensureStatusColumnExists();

    // Tạo invoice bằng Prisma (status sẽ có giá trị mặc định từ database)
    const createdInvoice = await this.prisma.invoice.create({
      data: createInvoiceDto,
    });

    // Lấy lại invoice vừa tạo với status bằng raw query
    return this.findOne(createdInvoice.id);
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    // Đảm bảo cột status tồn tại
    await this.ensureStatusColumnExists();

    // Dùng raw query để lấy invoice với status
    const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      ORDER BY i."CreateDate" DESC
    `) as any[];

    return invoices.map((invoice) => ({
      id: invoice.id,
      createdAt: invoice.createdAt,
      serviceId: invoice.serviceId,
      residentId: invoice.residentId,
      name: invoice.name,
      money: parseFloat(invoice.money),
      status: invoice.status || 'unpaid',
      service: invoice.service,
      resident: invoice.resident,
    })) as InvoiceResponseDto[];
  }

  async getAllByResidentId(residentId: string): Promise<InvoiceResponseDto[]> {
    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${residentId} not found`);
    }

    // Đảm bảo cột status tồn tại
    await this.ensureStatusColumnExists();

    // Dùng raw query để lấy invoice với status
    const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_resident" = '${residentId}'
      ORDER BY i."CreateDate" DESC
    `) as any[];

    return invoices.map((invoice) => ({
      id: invoice.id,
      createdAt: invoice.createdAt,
      serviceId: invoice.serviceId,
      residentId: invoice.residentId,
      name: invoice.name,
      money: parseFloat(invoice.money),
      status: invoice.status || 'unpaid',
      service: invoice.service,
      resident: invoice.resident,
    })) as InvoiceResponseDto[];
  }

  async getAllByServiceId(serviceId: number): Promise<InvoiceResponseDto[]> {
    // Kiểm tra service tồn tại
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Đảm bảo cột status tồn tại
    await this.ensureStatusColumnExists();

    // Dùng raw query để lấy invoice với status
    const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_service" = ${serviceId}
      ORDER BY i."CreateDate" DESC
    `) as any[];

    return invoices.map((invoice) => ({
      id: invoice.id,
      createdAt: invoice.createdAt,
      serviceId: invoice.serviceId,
      residentId: invoice.residentId,
      name: invoice.name,
      money: parseFloat(invoice.money),
      status: invoice.status || 'unpaid',
      service: invoice.service,
      resident: invoice.resident,
    })) as InvoiceResponseDto[];
  }

  async findOne(id: string): Promise<InvoiceResponseDto> {
    // Đảm bảo cột status tồn tại
    await this.ensureStatusColumnExists();

    // Dùng raw query để lấy invoice với status
    const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_invoice" = '${id}'
    `) as any[];

    if (invoices.length === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    const invoice = invoices[0];
    return {
      id: invoice.id,
      createdAt: invoice.createdAt,
      serviceId: invoice.serviceId,
      residentId: invoice.residentId,
      name: invoice.name,
      money: parseFloat(invoice.money),
      status: invoice.status || 'unpaid',
      service: invoice.service,
      resident: invoice.resident,
    } as InvoiceResponseDto;
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

    return invoice as unknown as InvoiceResponseDto;
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
    const existingInvoice = await this.findOne(id);

    try {
      // Đảm bảo cột status tồn tại
      await this.ensureStatusColumnExists();

      // Cập nhật trạng thái Invoice thành "pending" (chờ duyệt)
      await this.prisma.$executeRawUnsafe(
        `UPDATE invoices SET status = 'pending' WHERE "ID_invoice" = '${id}'`,
      );

      // Lấy lại invoice với status bằng raw query để đảm bảo có field status
      const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `) as any[];

      if (updatedInvoice.length === 0) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const invoice = updatedInvoice[0];
      return {
        id: invoice.id,
        createdAt: invoice.createdAt,
        serviceId: invoice.serviceId,
        residentId: invoice.residentId,
        name: invoice.name,
        money: parseFloat(invoice.money),
        status: invoice.status || 'pending',
        service: invoice.service,
        resident: invoice.resident,
      } as InvoiceResponseDto;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw new NotFoundException(
        `Failed to update invoice status: ${error.message}`,
      );
    }
  }

  private async ensureStatusColumnExists(): Promise<void> {
    try {
      // Kiểm tra xem cột status đã tồn tại chưa
      const result = await this.prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'status'
      `) as Array<{ column_name: string }>;

      if (result.length === 0) {
        // Thêm cột status nếu chưa tồn tại
        await this.prisma.$executeRawUnsafe(`
          ALTER TABLE invoices 
          ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'unpaid'
        `);
        console.log('Status column added to invoices table');
      }
    } catch (error) {
      console.error('Error ensuring status column exists:', error);
      // Không throw error ở đây để không block việc update
    }
  }

  async approveInvoice(id: string): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    await this.findOne(id);

    try {
      // Đảm bảo cột status tồn tại
      await this.ensureStatusColumnExists();

      // Cập nhật trạng thái Invoice thành "paid" (đã duyệt)
      await this.prisma.$executeRawUnsafe(
        `UPDATE invoices SET status = 'paid' WHERE "ID_invoice" = '${id}'`,
      );

      // Lấy lại invoice với status bằng raw query
      const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `) as any[];

      if (updatedInvoice.length === 0) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const invoice = updatedInvoice[0];
      return {
        id: invoice.id,
        createdAt: invoice.createdAt,
        serviceId: invoice.serviceId,
        residentId: invoice.residentId,
        name: invoice.name,
        money: parseFloat(invoice.money),
        status: invoice.status || 'paid',
        service: invoice.service,
        resident: invoice.resident,
      } as InvoiceResponseDto;
    } catch (error) {
      console.error('Error approving invoice:', error);
      throw new NotFoundException(
        `Failed to approve invoice: ${error.message}`,
      );
    }
  }

  async rejectInvoice(id: string): Promise<InvoiceResponseDto> {
    // Kiểm tra invoice tồn tại
    await this.findOne(id);

    try {
      // Đảm bảo cột status tồn tại
      await this.ensureStatusColumnExists();

      // Cập nhật trạng thái Invoice thành "unpaid" (từ chối)
      await this.prisma.$executeRawUnsafe(
        `UPDATE invoices SET status = 'unpaid' WHERE "ID_invoice" = '${id}'`,
      );

      // Lấy lại invoice với status bằng raw query
      const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `) as any[];

      if (updatedInvoice.length === 0) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      const invoice = updatedInvoice[0];
      return {
        id: invoice.id,
        createdAt: invoice.createdAt,
        serviceId: invoice.serviceId,
        residentId: invoice.residentId,
        name: invoice.name,
        money: parseFloat(invoice.money),
        status: invoice.status || 'unpaid',
        service: invoice.service,
        resident: invoice.resident,
      } as InvoiceResponseDto;
    } catch (error) {
      console.error('Error rejecting invoice:', error);
      throw new NotFoundException(
        `Failed to reject invoice: ${error.message}`,
      );
    }
  }
}
