import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Resident } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResidentService {
  constructor(private prisma: PrismaService) {}

  private calculateAge(birthDate: Date): number {
    const now = new Date();
    return (
      now.getFullYear() -
      birthDate.getFullYear() -
      (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0)
    );
  }

  async create(data: CreateResidentDto) {
    const role = (data.role || 'resident').toLowerCase();
    const normalizedApartmentId =
      data.apartmentId && data.apartmentId !== 'default'
        ? data.apartmentId
        : null;
    const requiresApartment = role === 'resident';

    if (requiresApartment && !normalizedApartmentId) {
      throw new BadRequestException('Resident must be assigned to an apartment');
    }

    const duplicateName = await this.prisma.resident.findFirst({
      where: { fullName: data.fullName },
    });

    if (duplicateName) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    if (/\d/.test(data.fullName || '')) {
      throw new BadRequestException('Họ tên không được chứa số');
    }

    const birthDate = new Date(data.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      throw new BadRequestException('Ngày sinh không hợp lệ');
    }

    const age = this.calculateAge(birthDate);

    if (age < 18) {
      throw new BadRequestException('Người dùng phải từ 18 tuổi');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Tài khoản resident cần được admin duyệt, các role khác được duyệt tự động
    const approved = role !== 'resident';
    try {
      return await this.prisma.resident.create({
        data: {
          apartmentId: normalizedApartmentId,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          password: hashedPassword,
          role,
          temporaryStatus: data.temporaryStatus ?? false,
          idNumber: data.idNumber,
          birthDate: new Date(data.birthDate),
          approved,
        } as any,
        include: {
          apartment: true,
          notifications: true,
          invoices: true,
          complains: true,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const metaTargets = (error.meta?.target as string[]) ?? [];
        if (metaTargets.includes('email')) {
          throw new BadRequestException('Email đã được sử dụng');
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.resident.findMany({
      where: {
        role: 'resident',
      },
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

    if (data.fullName !== undefined) {
      const trimmedName = data.fullName.trim();
      if (!trimmedName) {
        throw new BadRequestException('Họ tên không được để trống');
      }
      if (/\d/.test(trimmedName)) {
        throw new BadRequestException('Họ tên không được chứa số');
      }
      updateData.fullName = trimmedName;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.birthDate) {
      const birthDate = new Date(data.birthDate);
      if (Number.isNaN(birthDate.getTime())) {
        throw new BadRequestException('Ngày sinh không hợp lệ');
      }
      const age = this.calculateAge(birthDate);
      if (age < 18) {
        throw new BadRequestException('Người dùng phải từ 18 tuổi');
      }
      updateData.birthDate = birthDate;
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

  async remove(id: string) {
    try {
      // Xóa các quan hệ trước khi xóa resident
      await this.prisma.residentNotification.deleteMany({
        where: { residentId: id },
      });

      await this.prisma.invoice.deleteMany({
        where: { residentId: id },
      });

      await this.prisma.complain.deleteMany({
        where: { residentId: id },
      });

      // Xóa resident
      return await this.prisma.resident.delete({ where: { id } });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Không tìm thấy cư dân');
        }
        console.error('Prisma error when deleting resident:', error);
        throw new BadRequestException('Không thể xóa cư dân. Vui lòng thử lại.');
      }
      console.error('Error when deleting resident:', error);
      throw new BadRequestException('Không thể xóa cư dân. Vui lòng thử lại.');
    }
  }

  async toggleTemporaryStatus(id: string) {
    try {
      const resident = await this.prisma.resident.findUnique({
        where: { id },
        select: {
          id: true,
          temporaryStatus: true,
          role: true,
        } as any,
      }) as { id: string; temporaryStatus: boolean; role: string } | null;

      if (!resident) {
        throw new BadRequestException('Không tìm thấy cư dân');
      }

      // Chỉ cho phép đổi trạng thái các tài khoản có role là 'resident'
      if (resident.role.toLowerCase() !== 'resident') {
        throw new BadRequestException('Chỉ có thể đổi trạng thái tài khoản cư dân');
      }

      return await this.prisma.resident.update({
        where: { id },
        data: { temporaryStatus: !resident.temporaryStatus } as any,
        include: {
          apartment: true,
          notifications: true,
          invoices: true,
          complains: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Không tìm thấy cư dân');
        }
        console.error('Prisma error when toggling temporary status:', error);
        throw new BadRequestException('Không thể đổi trạng thái. Vui lòng thử lại.');
      }
      console.error('Error when toggling temporary status:', error);
      throw new BadRequestException('Không thể đổi trạng thái. Vui lòng thử lại.');
    }
  }

  async approve(id: string) {
    try {
      const resident = await this.prisma.resident.findUnique({
        where: { id },
        select: {
          id: true,
          approved: true,
          role: true,
        } as any,
      }) as { id: string; approved: boolean; role: string } | null;

      if (!resident) {
        throw new BadRequestException('Không tìm thấy cư dân');
      }

      // Chỉ cho phép duyệt các tài khoản có role là 'resident'
      if (resident.role.toLowerCase() !== 'resident') {
        throw new BadRequestException('Chỉ có thể duyệt tài khoản cư dân');
      }

      if (resident.approved) {
        throw new BadRequestException('Tài khoản đã được duyệt');
      }

      return await this.prisma.resident.update({
        where: { id },
        data: { approved: true } as any,
        include: {
          apartment: true,
          notifications: true,
          invoices: true,
          complains: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Không tìm thấy cư dân');
        }
        console.error('Prisma error when approving resident:', error);
        throw new BadRequestException('Không thể duyệt tài khoản. Vui lòng thử lại.');
      }
      console.error('Error when approving resident:', error);
      throw new BadRequestException('Không thể duyệt tài khoản. Vui lòng thử lại.');
    }
  }
}
