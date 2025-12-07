import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
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
      throw new UnauthorizedException('Invalid credentials');
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
      throw new UnauthorizedException('Invalid credentials');
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
}
