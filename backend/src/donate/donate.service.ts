// src/donate/donate.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDonateDto,
  UpdateDonateDto,
  DonateResponseDto,
  AddResidentToDonateDto,
  UpdateDonateResidentDto,
  DonateResidentResponseDto,
} from './donate.dto';

@Injectable()
export class DonateService {
  constructor(private prisma: PrismaService) {}

  async create(createDonateDto: CreateDonateDto): Promise<DonateResponseDto> {
    const { residentIds, ...donateData } = createDonateDto;

    // Tạo donate
    const donate = await this.prisma.donate.create({
      data: {
        money: donateData.money,
        name: donateData.name,
        description: donateData.description,
      },
      include: {
        residents: {
          include: {
            resident: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    // Nếu có residentIds, thêm các cư dân vào quyên góp
    if (residentIds && residentIds.length > 0) {
      // Kiểm tra tất cả residents tồn tại
      const residents = await this.prisma.resident.findMany({
        where: {
          id: {
            in: residentIds,
          },
        },
      });

      if (residents.length !== residentIds.length) {
        throw new BadRequestException('Một hoặc nhiều cư dân không tồn tại');
      }

      // Tạo các quan hệ donate-resident
      await this.prisma.donateResident.createMany({
        data: residentIds.map((residentId) => ({
          donateId: donate.id,
          residentId,
          status: 'pending',
        })),
      });

      // Lấy lại donate với residents
      return this.findOne(donate.id);
    }

    return this.mapToResponseDto(donate);
  }

  async findAll(): Promise<DonateResponseDto[]> {
    const donates = await this.prisma.donate.findMany({
      include: {
        residents: {
          include: {
            resident: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return donates.map((donate) => this.mapToResponseDto(donate));
  }

  async findOne(id: string): Promise<DonateResponseDto> {
    const donate = await this.prisma.donate.findUnique({
      where: { id },
      include: {
        residents: {
          include: {
            resident: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!donate) {
      throw new NotFoundException(`Donate with ID ${id} not found`);
    }

    return this.mapToResponseDto(donate);
  }

  async update(
    id: string,
    updateDonateDto: UpdateDonateDto,
  ): Promise<DonateResponseDto> {
    await this.findOne(id);

    const { residentIds, ...donateData } = updateDonateDto;

    const updateData: any = {};
    if (donateData.money !== undefined) updateData.money = donateData.money;
    if (donateData.name !== undefined) updateData.name = donateData.name;
    if (donateData.description !== undefined)
      updateData.description = donateData.description;

    await this.prisma.donate.update({
      where: { id },
      data: updateData,
    });

    // Nếu có residentIds, cập nhật danh sách cư dân
    if (residentIds !== undefined) {
      // Xóa tất cả quan hệ cũ
      await this.prisma.donateResident.deleteMany({
        where: { donateId: id },
      });

      // Tạo lại quan hệ mới
      if (residentIds.length > 0) {
        const residents = await this.prisma.resident.findMany({
          where: {
            id: {
              in: residentIds,
            },
          },
        });

        if (residents.length !== residentIds.length) {
          throw new BadRequestException('Một hoặc nhiều cư dân không tồn tại');
        }

        await this.prisma.donateResident.createMany({
          data: residentIds.map((residentId) => ({
            donateId: id,
            residentId,
            status: 'pending',
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    // Xóa tất cả quan hệ donate-resident trước
    await this.prisma.donateResident.deleteMany({
      where: { donateId: id },
    });

    // Xóa donate
    await this.prisma.donate.delete({
      where: { id },
    });

    return { message: `Donate with ID ${id} has been deleted successfully` };
  }

  // Thêm cư dân vào quyên góp
  async addResident(
    donateId: string,
    addResidentDto: AddResidentToDonateDto,
  ): Promise<DonateResidentResponseDto> {
    // Kiểm tra donate tồn tại
    await this.findOne(donateId);

    // Kiểm tra resident tồn tại
    const resident = await this.prisma.resident.findUnique({
      where: { id: addResidentDto.residentId },
    });
    if (!resident) {
      throw new NotFoundException(
        `Resident with ID ${addResidentDto.residentId} not found`,
      );
    }

    // Kiểm tra quan hệ đã tồn tại chưa
    const existing = await this.prisma.donateResident.findUnique({
      where: {
        donateId_residentId: {
          donateId,
          residentId: addResidentDto.residentId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Cư dân đã được thêm vào quyên góp này',
      );
    }

    // Tạo quan hệ mới
    const donateResident = await this.prisma.donateResident.create({
      data: {
        donateId,
        residentId: addResidentDto.residentId,
        status: addResidentDto.status || 'pending',
      },
      include: {
        donate: {
          include: {
            residents: {
              include: {
                resident: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
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

    return this.mapDonateResidentToResponseDto(donateResident);
  }

  // Xóa cư dân khỏi quyên góp
  async removeResident(
    donateId: string,
    residentId: string,
  ): Promise<{ message: string }> {
    // Kiểm tra quan hệ tồn tại
    const donateResident = await this.prisma.donateResident.findUnique({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
    });

    if (!donateResident) {
      throw new NotFoundException(
        'Cư dân không tham gia quyên góp này',
      );
    }

    await this.prisma.donateResident.delete({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
    });

    return {
      message: `Resident has been removed from donate successfully`,
    };
  }

  // Cập nhật trạng thái của cư dân trong quyên góp
  async updateResidentStatus(
    donateId: string,
    residentId: string,
    updateDto: UpdateDonateResidentDto,
  ): Promise<DonateResidentResponseDto> {
    // Kiểm tra quan hệ tồn tại
    const existing = await this.prisma.donateResident.findUnique({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        'Cư dân không tham gia quyên góp này',
      );
    }

    const updateData: any = {};
    if (updateDto.status !== undefined) updateData.status = updateDto.status;

    const donateResident = await this.prisma.donateResident.update({
      where: {
        donateId_residentId: {
          donateId,
          residentId,
        },
      },
      data: updateData,
      include: {
        donate: {
          include: {
            residents: {
              include: {
                resident: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
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

    return this.mapDonateResidentToResponseDto(donateResident);
  }

  // Lấy tất cả quyên góp của một cư dân
  async getAllByResidentId(
    residentId: string,
  ): Promise<DonateResponseDto[]> {
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
        donate: {
          include: {
            residents: {
              include: {
                resident: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        donate: {
          createdAt: 'desc',
        },
      },
    });

    return donateResidents.map((dr) => this.mapToResponseDto(dr.donate));
  }

  // Helper methods
  private mapToResponseDto(donate: any): DonateResponseDto {
    return {
      id: donate.id,
      money: donate.money,
      name: donate.name,
      description: donate.description,
      createdAt: donate.createdAt,
      residents: donate.residents?.map((dr: any) =>
        this.mapDonateResidentToResponseDto(dr),
      ),
    };
  }

  private mapDonateResidentToResponseDto(
    donateResident: any,
  ): DonateResidentResponseDto {
    return {
      donateId: donateResident.donateId,
      residentId: donateResident.residentId,
      status: donateResident.status,
      donate: donateResident.donate
        ? this.mapToResponseDto(donateResident.donate)
        : undefined,
      resident: donateResident.resident,
    };
  }
}
