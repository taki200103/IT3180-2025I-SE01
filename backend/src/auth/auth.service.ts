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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      resident.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
