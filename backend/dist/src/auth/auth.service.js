"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const resident = await this.prisma.resident.findFirst({
            where: { email: loginDto.email },
        });
        if (!resident) {
            console.log(`[Auth] User not found: ${loginDto.email}`);
            throw new common_1.UnauthorizedException('Email không tồn tại');
        }
        console.log(`[Auth] Found user: ${resident.email}, password hash starts with: ${resident.password.substring(0, 10)}...`);
        let isPasswordValid;
        if (resident.password.startsWith('$2')) {
            isPasswordValid = await bcrypt.compare(loginDto.password, resident.password);
            console.log(`[Auth] Password comparison result: ${isPasswordValid}`);
        }
        else {
            isPasswordValid = loginDto.password === resident.password;
            console.log(`[Auth] Plain text password comparison result: ${isPasswordValid}`);
        }
        if (!isPasswordValid) {
            console.log(`[Auth] Invalid password for user: ${loginDto.email}`);
            throw new common_1.UnauthorizedException('Mật khẩu không chính xác');
        }
        if (resident.role === 'resident' && !resident.approved) {
            console.log(`[Auth] Account not approved: ${loginDto.email}`);
            throw new common_1.UnauthorizedException('Tài khoản của bạn chưa được duyệt. Vui lòng chờ admin duyệt.');
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
    async validateUser(id) {
        return this.prisma.resident.findUnique({ where: { id } });
    }
    async forgotPassword(dto) {
        const resident = await this.prisma.resident.findUnique({
            where: { email: dto.email },
        });
        if (!resident) {
            throw new common_1.BadRequestException('Email không tồn tại');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.resident.update({
            where: { email: dto.email },
            data: { password: hashedPassword },
        });
        return { message: 'Đặt lại mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map