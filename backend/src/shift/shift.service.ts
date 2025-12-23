import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto, UpdateShiftDto, ShiftType } from './shift.dto';

@Injectable()
export class ShiftService {
  constructor(private prisma: PrismaService) {}

  private get db(): PrismaClient & Record<string, any> {
    // Cast để TypeScript nhận diện đầy đủ các model (bao gồm shift)
    return this.prisma as unknown as PrismaClient & Record<string, any>;
  }

  async create(data: CreateShiftDto) {
    // Kiểm tra bảo vệ có tồn tại và có role là 'guard' không
    const guard = await this.db.resident.findUnique({
      where: { id: data.guardId },
    });

    if (!guard) {
      throw new NotFoundException('Không tìm thấy bảo vệ');
    }

    if (guard.role.toLowerCase() !== 'guard') {
      throw new BadRequestException('Người được phân công phải là bảo vệ');
    }

    // Kiểm tra xem ca trực đã được phân công chưa
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Ngày không hợp lệ');
    }
    date.setHours(0, 0, 0, 0);

    const existingShift = await this.db.shift.findUnique({
      where: {
        date_shiftType: {
          date: date,
          shiftType: data.shiftType,
        },
      },
    });

    if (existingShift) {
      throw new BadRequestException('Ca trực này đã được phân công');
    }

    // Tạo ca trực mới
    return await this.db.shift.create({
      data: {
        date: date,
        shiftType: data.shiftType,
        guardId: data.guardId,
      },
      include: {
        guard: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findAll(startDate?: string, endDate?: string) {
    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          throw new BadRequestException('Ngày bắt đầu không hợp lệ');
        }
        start.setHours(0, 0, 0, 0);
        where.date.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          throw new BadRequestException('Ngày kết thúc không hợp lệ');
        }
        end.setHours(23, 59, 59, 999);
        where.date.lte = end;
      }
    }

    return await this.db.shift.findMany({
      where,
      include: {
        guard: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const shift = await this.db.shift.findUnique({
      where: { id },
      include: {
        guard: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!shift) {
      throw new NotFoundException('Không tìm thấy ca trực');
    }

    return shift;
  }

  async update(id: string, data: UpdateShiftDto) {
    const shift = await this.db.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Không tìm thấy ca trực');
    }

    if (data.guardId) {
      // Kiểm tra bảo vệ có tồn tại và có role là 'guard' không
      const guard = await this.db.resident.findUnique({
        where: { id: data.guardId },
      });

      if (!guard) {
        throw new NotFoundException('Không tìm thấy bảo vệ');
      }

      if (guard.role.toLowerCase() !== 'guard') {
        throw new BadRequestException('Người được phân công phải là bảo vệ');
      }
    }

    // Chuẩn hóa ngày và loại ca nếu được cung cấp
    const newDate =
      data.date !== undefined
        ? (() => {
            const d = new Date(data.date as string);
            if (isNaN(d.getTime())) {
              throw new BadRequestException('Ngày không hợp lệ');
            }
            d.setHours(0, 0, 0, 0);
            return d;
          })()
        : shift.date;

    const newShiftType = (data.shiftType as ShiftType | undefined) ?? shift.shiftType;

    // Nếu thay đổi date hoặc shiftType, kiểm tra trùng ca
    if (data.date !== undefined || data.shiftType !== undefined) {
      const conflict = await this.db.shift.findFirst({
        where: {
          date: newDate,
          shiftType: newShiftType,
          NOT: { id },
        },
      });

      if (conflict) {
        throw new BadRequestException('Ca trực này đã được phân công');
      }
    }

    return await this.db.shift.update({
      where: { id },
      data: {
        ...(data.guardId && { guardId: data.guardId }),
        ...(data.date !== undefined && { date: newDate }),
        ...(data.shiftType !== undefined && { shiftType: newShiftType }),
      },
      include: {
        guard: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const shift = await this.db.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Không tìm thấy ca trực');
    }

    return await this.db.shift.delete({
      where: { id },
    });
  }

  async getGuardList() {
    return await this.db.resident.findMany({
      where: {
        role: 'guard',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  }
}

