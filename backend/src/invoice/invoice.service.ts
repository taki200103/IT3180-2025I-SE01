// src/invoice/invoice.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from './invoice.dtos';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tính tiền điện theo bậc thang
   */
  private calculateElectricityCost(kWh: number): number {
    let total = 0;
    let remaining = kWh;

    // Bậc 1 (0 - 50 kWh): 1.984 đồng/kWh
    if (remaining > 0) {
      const tier1 = Math.min(remaining, 50);
      total += tier1 * 1984;
      remaining -= tier1;
    }

    // Bậc 2 (51 - 100 kWh): 2.050 đồng/kWh
    if (remaining > 0) {
      const tier2 = Math.min(remaining, 50);
      total += tier2 * 2050;
      remaining -= tier2;
    }

    // Bậc 3 (101 - 200 kWh): 2.380 đồng/kWh
    if (remaining > 0) {
      const tier3 = Math.min(remaining, 100);
      total += tier3 * 2380;
      remaining -= tier3;
    }

    // Bậc 4 (201 - 300 kWh): 2.998 đồng/kWh
    if (remaining > 0) {
      const tier4 = Math.min(remaining, 100);
      total += tier4 * 2998;
      remaining -= tier4;
    }

    // Bậc 5 (301 - 400 kWh): 3.350 đồng/kWh
    if (remaining > 0) {
      const tier5 = Math.min(remaining, 100);
      total += tier5 * 3350;
      remaining -= tier5;
    }

    // Bậc 6 (401 kWh trở lên): 3.460 đồng/kWh
    if (remaining > 0) {
      total += remaining * 3460;
    }

    return total;
  }

  /**
   * Tính số tiền dựa trên loại dịch vụ
   */
  private async calculateAmount(
    serviceId: number,
    residentId: string,
    createInvoiceDto: CreateInvoiceDto,
  ): Promise<number> {
    // Lấy thông tin resident và apartment
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
      include: { apartment: true },
    });

    if (!resident || !resident.apartment) {
      throw new BadRequestException('Resident phải có căn hộ để tính phí');
    }

    const apartment = resident.apartment;

    switch (serviceId) {
      case 1: // "Phí dịch vụ" - 13k/m²
        return 13000 * apartment.area;

      case 2: // "Phí quản lí" - 7k/m²
        return 7000 * apartment.area;

      case 3: // "Phí khác" - nhập tay
        if (!createInvoiceDto.money || createInvoiceDto.money <= 0) {
          throw new BadRequestException('Phí khác yêu cầu nhập số tiền');
        }
        return Number(createInvoiceDto.money);

      case 4: // "Phí điện" - tính theo bậc thang
        if (!createInvoiceDto.kWh || createInvoiceDto.kWh < 0) {
          throw new BadRequestException('Phí điện yêu cầu nhập số kWh');
        }
        return this.calculateElectricityCost(Number(createInvoiceDto.kWh));

      case 5: // "Phí nước" - m³ * 10000
        if (!createInvoiceDto.waterM3 || createInvoiceDto.waterM3 < 0) {
          throw new BadRequestException('Phí nước yêu cầu nhập số m³');
        }
        return Number(createInvoiceDto.waterM3) * 10000;

      case 6: // "Internet" - cố định 200k
        return 200000;

      default:
        // Các service khác sử dụng money từ DTO
        if (!createInvoiceDto.money || createInvoiceDto.money <= 0) {
          throw new BadRequestException('Service này yêu cầu nhập số tiền');
        }
        return Number(createInvoiceDto.money);
    }
  }

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

    // Kiểm tra resident tồn tại và lấy thông tin apartment
    const resident = await this.prisma.resident.findUnique({
      where: { id: createInvoiceDto.residentId },
      include: { apartment: true },
    });
    if (!resident) {
      throw new NotFoundException(
        `Resident with ID ${createInvoiceDto.residentId} not found`,
      );
    }

    // Kiểm tra nếu service là 1-6 thì chỉ owner mới được tạo
    const ownerOnlyServices = [1, 2, 3, 4, 5, 6];
    if (ownerOnlyServices.includes(createInvoiceDto.serviceId)) {
      if (!resident.apartment) {
        throw new BadRequestException(
          'Resident phải có căn hộ để tạo hóa đơn cho loại phí này',
        );
      }

      // Kiểm tra resident có phải là owner không
      if (resident.id !== resident.apartment.ownerId) {
        throw new BadRequestException(
          'Chỉ chủ căn hộ (owner) mới được tạo hóa đơn cho loại phí này',
        );
      }
    }

    // Tính số tiền dựa trên loại service
    const calculatedAmount = await this.calculateAmount(
      createInvoiceDto.serviceId,
      createInvoiceDto.residentId,
      createInvoiceDto,
    );

    // Tạo invoice với số tiền đã tính
    const invoice = await this.prisma.invoice.create({
      data: {
        serviceId: createInvoiceDto.serviceId,
        residentId: createInvoiceDto.residentId,
        name: createInvoiceDto.name,
        money: calculatedAmount,
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
    await this.findOne(id);

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
    await this.findOne(id);

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
    await this.findOne(id);

    // Đánh dấu riêng hóa đơn này là 'unpaid' (từ chối)
    await this.prisma.invoice.update({
      where: { id },
      data: { status: 'unpaid' },
    });

    // Lấy lại invoice đã cập nhật
    return this.findOne(id);
  }
}
