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
exports.ResidentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let ResidentService = class ResidentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateAge(birthDate) {
        const now = new Date();
        return (now.getFullYear() -
            birthDate.getFullYear() -
            (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0));
    }
    async create(data) {
        const role = (data.role || 'resident').toLowerCase();
        const normalizedApartmentId = data.apartmentId && data.apartmentId !== 'default'
            ? data.apartmentId
            : null;
        const requiresApartment = role === 'resident';
        if (requiresApartment && !normalizedApartmentId) {
            throw new common_1.BadRequestException('Resident must be assigned to an apartment');
        }
        const duplicateName = await this.prisma.resident.findFirst({
            where: { fullName: data.fullName },
        });
        if (duplicateName) {
            throw new common_1.BadRequestException('Tên đăng nhập đã tồn tại');
        }
        if (/\d/.test(data.fullName || '')) {
            throw new common_1.BadRequestException('Họ tên không được chứa số');
        }
        const birthDate = new Date(data.birthDate);
        if (Number.isNaN(birthDate.getTime())) {
            throw new common_1.BadRequestException('Ngày sinh không hợp lệ');
        }
        const age = this.calculateAge(birthDate);
        if (age < 18) {
            throw new common_1.BadRequestException('Người dùng phải từ 18 tuổi');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
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
                },
                include: {
                    apartment: true,
                    notifications: true,
                    invoices: true,
                    complains: true,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                const metaTargets = error.meta?.target ?? [];
                if (metaTargets.includes('email')) {
                    throw new common_1.BadRequestException('Email đã được sử dụng');
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
    findOne(id) {
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
    async update(id, data) {
        const updateData = { ...data };
        if (data.fullName !== undefined) {
            const trimmedName = data.fullName.trim();
            if (!trimmedName) {
                throw new common_1.BadRequestException('Họ tên không được để trống');
            }
            if (/\d/.test(trimmedName)) {
                throw new common_1.BadRequestException('Họ tên không được chứa số');
            }
            updateData.fullName = trimmedName;
        }
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        if (data.birthDate) {
            const birthDate = new Date(data.birthDate);
            if (Number.isNaN(birthDate.getTime())) {
                throw new common_1.BadRequestException('Ngày sinh không hợp lệ');
            }
            const age = this.calculateAge(birthDate);
            if (age < 18) {
                throw new common_1.BadRequestException('Người dùng phải từ 18 tuổi');
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
    async remove(id) {
        try {
            await this.prisma.residentNotification.deleteMany({
                where: { residentId: id },
            });
            await this.prisma.invoice.deleteMany({
                where: { residentId: id },
            });
            await this.prisma.complain.deleteMany({
                where: { residentId: id },
            });
            return await this.prisma.resident.delete({ where: { id } });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.BadRequestException('Không tìm thấy cư dân');
                }
                console.error('Prisma error when deleting resident:', error);
                throw new common_1.BadRequestException('Không thể xóa cư dân. Vui lòng thử lại.');
            }
            console.error('Error when deleting resident:', error);
            throw new common_1.BadRequestException('Không thể xóa cư dân. Vui lòng thử lại.');
        }
    }
    async toggleTemporaryStatus(id) {
        try {
            const resident = await this.prisma.resident.findUnique({
                where: { id },
                select: {
                    id: true,
                    temporaryStatus: true,
                    role: true,
                },
            });
            if (!resident) {
                throw new common_1.BadRequestException('Không tìm thấy cư dân');
            }
            if (resident.role.toLowerCase() !== 'resident') {
                throw new common_1.BadRequestException('Chỉ có thể đổi trạng thái tài khoản cư dân');
            }
            return await this.prisma.resident.update({
                where: { id },
                data: { temporaryStatus: !resident.temporaryStatus },
                include: {
                    apartment: true,
                    notifications: true,
                    invoices: true,
                    complains: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.BadRequestException('Không tìm thấy cư dân');
                }
                console.error('Prisma error when toggling temporary status:', error);
                throw new common_1.BadRequestException('Không thể đổi trạng thái. Vui lòng thử lại.');
            }
            console.error('Error when toggling temporary status:', error);
            throw new common_1.BadRequestException('Không thể đổi trạng thái. Vui lòng thử lại.');
        }
    }
    async approve(id) {
        try {
            const resident = await this.prisma.resident.findUnique({
                where: { id },
                select: {
                    id: true,
                    approved: true,
                    role: true,
                },
            });
            if (!resident) {
                throw new common_1.BadRequestException('Không tìm thấy cư dân');
            }
            if (resident.role.toLowerCase() !== 'resident') {
                throw new common_1.BadRequestException('Chỉ có thể duyệt tài khoản cư dân');
            }
            if (resident.approved) {
                throw new common_1.BadRequestException('Tài khoản đã được duyệt');
            }
            return await this.prisma.resident.update({
                where: { id },
                data: { approved: true },
                include: {
                    apartment: true,
                    notifications: true,
                    invoices: true,
                    complains: true,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.BadRequestException('Không tìm thấy cư dân');
                }
                console.error('Prisma error when approving resident:', error);
                throw new common_1.BadRequestException('Không thể duyệt tài khoản. Vui lòng thử lại.');
            }
            console.error('Error when approving resident:', error);
            throw new common_1.BadRequestException('Không thể duyệt tài khoản. Vui lòng thử lại.');
        }
    }
};
exports.ResidentService = ResidentService;
exports.ResidentService = ResidentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResidentService);
//# sourceMappingURL=resident.service.js.map