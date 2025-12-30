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
exports.DonateresidentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DonateresidentService = class DonateresidentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDonateResidentDto) {
        const donate = await this.prisma.donate.findUnique({
            where: { id: createDonateResidentDto.donateId },
        });
        if (!donate) {
            throw new common_1.NotFoundException(`Donate with ID ${createDonateResidentDto.donateId} not found`);
        }
        const resident = await this.prisma.resident.findUnique({
            where: { id: createDonateResidentDto.residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${createDonateResidentDto.residentId} not found`);
        }
        const existing = await this.prisma.donateResident.findUnique({
            where: {
                donateId_residentId: {
                    donateId: createDonateResidentDto.donateId,
                    residentId: createDonateResidentDto.residentId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Quan hệ donate-resident đã tồn tại');
        }
        const donateResident = await this.prisma.donateResident.create({
            data: {
                donateId: createDonateResidentDto.donateId,
                residentId: createDonateResidentDto.residentId,
                status: createDonateResidentDto.status || 'pending',
            },
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(donateResident);
    }
    async findAll() {
        const donateResidents = await this.prisma.donateResident.findMany({
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                donate: {
                    createdAt: 'desc',
                },
            },
        });
        return donateResidents.map((dr) => this.mapToResponseDto(dr));
    }
    async findOne(donateId, residentId) {
        const donateResident = await this.prisma.donateResident.findUnique({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!donateResident) {
            throw new common_1.NotFoundException(`DonateResident with donateId ${donateId} and residentId ${residentId} not found`);
        }
        return this.mapToResponseDto(donateResident);
    }
    async update(donateId, residentId, updateDonateResidentDto) {
        await this.findOne(donateId, residentId);
        const updateData = {};
        if (updateDonateResidentDto.status !== undefined) {
            updateData.status = updateDonateResidentDto.status;
        }
        const donateResident = await this.prisma.donateResident.update({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
            data: updateData,
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        return this.mapToResponseDto(donateResident);
    }
    async remove(donateId, residentId) {
        await this.findOne(donateId, residentId);
        await this.prisma.donateResident.delete({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
        });
        return {
            message: `DonateResident has been deleted successfully`,
        };
    }
    async getAllByDonateId(donateId) {
        const donate = await this.prisma.donate.findUnique({
            where: { id: donateId },
        });
        if (!donate) {
            throw new common_1.NotFoundException(`Donate with ID ${donateId} not found`);
        }
        const donateResidents = await this.prisma.donateResident.findMany({
            where: { donateId },
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                resident: {
                    fullName: 'asc',
                },
            },
        });
        return donateResidents.map((dr) => this.mapToResponseDto(dr));
    }
    async getAllByResidentId(residentId) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${residentId} not found`);
        }
        const donateResidents = await this.prisma.donateResident.findMany({
            where: { residentId },
            include: {
                donate: true,
                resident: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                donate: {
                    createdAt: 'desc',
                },
            },
        });
        return donateResidents.map((dr) => this.mapToResponseDto(dr));
    }
    mapToResponseDto(donateResident) {
        return {
            donateId: donateResident.donateId,
            residentId: donateResident.residentId,
            status: donateResident.status,
            donate: donateResident.donate
                ? {
                    id: donateResident.donate.id,
                    money: donateResident.donate.money,
                    name: donateResident.donate.name,
                    description: donateResident.donate.description,
                    createdAt: donateResident.donate.createdAt,
                }
                : undefined,
            resident: donateResident.resident,
        };
    }
};
exports.DonateresidentService = DonateresidentService;
exports.DonateresidentService = DonateresidentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonateresidentService);
//# sourceMappingURL=donateresident.service.js.map