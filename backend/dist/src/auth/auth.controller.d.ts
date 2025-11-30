import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Resident } from '@prisma/client';
interface RequestWithUser extends Request {
    user: Resident;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
    getProfile(req: RequestWithUser): {
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
    };
}
export {};
