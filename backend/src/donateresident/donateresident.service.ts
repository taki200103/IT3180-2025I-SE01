// src/donateresident/donateresident.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDonateResidentDto,
  UpdateDonateResidentDto,
  DonateResidentResponseDto,
} from './donateresident.dto';

@Injectable()
export class DonateresidentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDonateResidentDto: CreateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    // Kiểm tra donate tồn tại
    const donate = await this.prisma.donate.findUnique({
      where: { id: createDonateResidentDto.donateId },
    });
    if (!donate) {
      throw new NotFoundException(
        `Donate with ID ${createDonateResidentDto.donateId} not found`,
      );
    }

    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: createDonateResidentDto.residentId },
    });
    if (!resident) {
      throw new NotFoundException(
        `Resident with ID ${createDonateResidentDto.residentId} not found`,
      );
    }

    // Kiểm tra quan hệ đã tồn tại chưa
    const existing = await this.prisma.donateResident.findUnique({
      where: {
        donateId_residentId: {
          donateId: createDonateResidentDto.donateId,
          residentId: createDonateResidentDto.residentId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Quan hệ donate-resident đã tồn tại',
      );
    }

    // Tạo quan hệ mới
    const donateResident = await this.prisma.donateResident.create({
      data: {
        donateId: createDonateResidentDto.donateId,
        residentId: createDonateResidentDto.residentId,
        status: createDonateResidentDto.status || 'pending',
      },
      include: {
        donate: true,
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

    return this.mapToResponseDto(donateResident);
  }

  async findAll(): Promise<DonateResidentResponseDto[]> {
    const donateResidents = await this.prisma.donateResident.findMany({
      include: {
        donate: true,
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
        donate: {
          createdAt: 'desc',
        },
      },
    });

    return donateResidents.map((dr) => this.mapToResponseDto(dr));
  }

  async findOne(
    donateId: string,
    residentId: string,
  ): Promise<DonateResidentResponseDto> {
    const donateResident = await this.prisma.donateResident.findUnique({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
      include: {
        donate: true,
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

    if (!donateResident) {
      throw new NotFoundException(
        `DonateResident with donateId ${donateId} and residentId ${residentId} not found`,
      );
    }

    return this.mapToResponseDto(donateResident);
  }

  async update(
    donateId: string,
    residentId: string,
    updateDonateResidentDto: UpdateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    // Kiểm tra quan hệ tồn tại
    await this.findOne(donateId, residentId);

    const updateData: any = {};
    if (updateDonateResidentDto.status !== undefined) {
      updateData.status = updateDonateResidentDto.status;
    }

    const donateResident = await this.prisma.donateResident.update({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
      data: updateData,
      include: {
        donate: true,
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

    return this.mapToResponseDto(donateResident);
  }

  async remove(
    donateId: string,
    residentId: string,
  ): Promise<{ message: string }> {
    // Kiểm tra quan hệ tồn tại
    await this.findOne(donateId, residentId);

    await this.prisma.donateResident.delete({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
    });

    return {
      message: `DonateResident has been deleted successfully`,
    };
  }

  // Lấy tất cả quan hệ theo donateId
  async getAllByDonateId(
    donateId: string,
  ): Promise<DonateResidentResponseDto[]> {
    // Kiểm tra donate tồn tại
    const donate = await this.prisma.donate.findUnique({
      where: { id: donateId },
    });
    if (!donate) {
      throw new NotFoundException(`Donate with ID ${donateId} not found`);
    }

    const donateResidents = await this.prisma.donateResident.findMany({
      where: { donateId },
      include: {
        donate: true,
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
        resident: {
          fullName: 'asc',
        },
      },
    });

    return donateResidents.map((dr) => this.mapToResponseDto(dr));
  }

  // Lấy tất cả quan hệ theo residentId
  async getAllByResidentId(
    residentId: string,
  ): Promise<DonateResidentResponseDto[]> {
    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${residentId} not found`);
    }

    const donateResidents = await this.prisma.donateResident.findMany({
      where: { residentId },
      include: {
        donate: true,
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
        donate: {
          createdAt: 'desc',
        },
      },
    });

    return donateResidents.map((dr) => this.mapToResponseDto(dr));
  }

  // Helper method
  private mapToResponseDto(donateResident: any): DonateResidentResponseDto {
    return {
      donateId: donateResident.donateId,
      residentId: donateResident.residentId,
      status: donateResident.status,
      donate: donateResident.donate
        ? {
            id: donateResident.donate.id,
            money: donateResident.donate.money,
            name: donateResident.donate.name,
            description: donateResident.donate.description,
            createdAt: donateResident.donate.createdAt,
          }
        : undefined,
      resident: donateResident.resident,
    };
  }
}
