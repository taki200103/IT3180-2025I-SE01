import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
    validateUser(id: string): Promise<{
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        apartmentId: string;
    } | null>;
}
