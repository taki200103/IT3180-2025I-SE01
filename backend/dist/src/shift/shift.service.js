"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ShiftService = class ShiftService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    get db() {
        return this.prisma;
    }
    async create(data) {
        const guard = await this.db.resident.findUnique({
            where: { id: data.guardId },
        });
        if (!guard) {
            throw new common_1.NotFoundException('Không tìm thấy bảo vệ');
        }
        if (guard.role.toLowerCase() !== 'guard') {
            throw new common_1.BadRequestException('Người được phân công phải là bảo vệ');
        }
        const date = new Date(data.date);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Ngày không hợp lệ');
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
            throw new common_1.BadRequestException('Ca trực này đã được phân công');
        }
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
    async findAll(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    throw new common_1.BadRequestException('Ngày bắt đầu không hợp lệ');
                }
                start.setHours(0, 0, 0, 0);
                where.date.gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    throw new common_1.BadRequestException('Ngày kết thúc không hợp lệ');
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Không tìm thấy ca trực');
        }
        return shift;
    }
    async update(id, data) {
        const shift = await this.db.shift.findUnique({
            where: { id },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Không tìm thấy ca trực');
        }
        if (data.guardId) {
            const guard = await this.db.resident.findUnique({
                where: { id: data.guardId },
            });
            if (!guard) {
                throw new common_1.NotFoundException('Không tìm thấy bảo vệ');
            }
            if (guard.role.toLowerCase() !== 'guard') {
                throw new common_1.BadRequestException('Người được phân công phải là bảo vệ');
            }
        }
        const newDate = data.date !== undefined
            ? (() => {
                const d = new Date(data.date);
                if (isNaN(d.getTime())) {
                    throw new common_1.BadRequestException('Ngày không hợp lệ');
                }
                d.setHours(0, 0, 0, 0);
                return d;
            })()
            : shift.date;
        const newShiftType = data.shiftType ?? shift.shiftType;
        if (data.date !== undefined || data.shiftType !== undefined) {
            const conflict = await this.db.shift.findFirst({
                where: {
                    date: newDate,
                    shiftType: newShiftType,
                    NOT: { id },
                },
            });
            if (conflict) {
                throw new common_1.BadRequestException('Ca trực này đã được phân công');
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
    async remove(id) {
        const shift = await this.db.shift.findUnique({
            where: { id },
        });
        if (!shift) {
            throw new common_1.NotFoundException('Không tìm thấy ca trực');
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
};
exports.ShiftService = ShiftService;
exports.ShiftService = ShiftService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftService);
//# sourceMappingURL=shift.service.js.map