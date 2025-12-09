import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const resident = await this.prisma.resident.findFirst({
      where: { email: loginDto.email },
    });

    if (!resident) {
      console.log(`[Auth] User not found: ${loginDto.email}`);
      throw new UnauthorizedException('Email không tồn tại');
    }

    console.log(`[Auth] Found user: ${resident.email}, password hash starts with: ${resident.password.substring(0, 10)}...`);

    // Kiểm tra nếu password chưa được hash (trường hợp dữ liệu cũ)
    let isPasswordValid: boolean;
    if (resident.password.startsWith('$2')) {
      // Password đã được hash bằng bcrypt
      isPasswordValid = await bcrypt.compare(
        loginDto.password,
        resident.password,
      );
      console.log(`[Auth] Password comparison result: ${isPasswordValid}`);
    } else {
      // Password chưa được hash (plain text) - chỉ dùng cho development
      isPasswordValid = loginDto.password === resident.password;
      console.log(`[Auth] Plain text password comparison result: ${isPasswordValid}`);
    }

    if (!isPasswordValid) {
      console.log(`[Auth] Invalid password for user: ${loginDto.email}`);
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    // Kiểm tra tài khoản đã được duyệt chưa (chỉ áp dụng cho resident)
    if (resident.role === 'resident' && !resident.approved) {
      console.log(`[Auth] Account not approved: ${loginDto.email}`);
      throw new UnauthorizedException('Tài khoản của bạn chưa được duyệt. Vui lòng chờ admin duyệt.');
    }

    console.log(`[Auth] Login successful for user: ${resident.email}`);

    const payload = {
      sub: resident.id,
      email: resident.email,
      role: resident.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: resident.id,
        email: resident.email,
        fullName: resident.fullName,
        role: resident.role,
      },
    };
  }

  async validateUser(id: string) {
    return this.prisma.resident.findUnique({ where: { id } });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const resident = await this.prisma.resident.findUnique({
      where: { email: dto.email },
    });

    if (!resident) {
      throw new BadRequestException('Email không tồn tại');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.resident.update({
      where: { email: dto.email },
      data: { password: hashedPassword },
    });

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}
