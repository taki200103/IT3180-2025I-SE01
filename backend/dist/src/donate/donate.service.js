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
exports.DonateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DonateService = class DonateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDonateDto) {
        const { residentIds, ...donateData } = createDonateDto;
        const donate = await this.prisma.donate.create({
            data: {
                money: donateData.money,
                name: donateData.name,
                description: donateData.description,
            },
            include: {
                residents: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (residentIds && residentIds.length > 0) {
            const residents = await this.prisma.resident.findMany({
                where: {
                    id: {
                        in: residentIds,
                    },
                },
            });
            if (residents.length !== residentIds.length) {
                throw new common_1.BadRequestException('Một hoặc nhiều cư dân không tồn tại');
            }
            await this.prisma.donateResident.createMany({
                data: residentIds.map((residentId) => ({
                    donateId: donate.id,
                    residentId,
                    status: 'pending',
                })),
            });
            return this.findOne(donate.id);
        }
        return this.mapToResponseDto(donate);
    }
    async findAll() {
        const donates = await this.prisma.donate.findMany({
            include: {
                residents: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return donates.map((donate) => this.mapToResponseDto(donate));
    }
    async findOne(id) {
        const donate = await this.prisma.donate.findUnique({
            where: { id },
            include: {
                residents: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
        if (!donate) {
            throw new common_1.NotFoundException(`Donate with ID ${id} not found`);
        }
        return this.mapToResponseDto(donate);
    }
    async update(id, updateDonateDto) {
        await this.findOne(id);
        const { residentIds, ...donateData } = updateDonateDto;
        const updateData = {};
        if (donateData.money !== undefined)
            updateData.money = donateData.money;
        if (donateData.name !== undefined)
            updateData.name = donateData.name;
        if (donateData.description !== undefined)
            updateData.description = donateData.description;
        await this.prisma.donate.update({
            where: { id },
            data: updateData,
        });
        if (residentIds !== undefined) {
            await this.prisma.donateResident.deleteMany({
                where: { donateId: id },
            });
            if (residentIds.length > 0) {
                const residents = await this.prisma.resident.findMany({
                    where: {
                        id: {
                            in: residentIds,
                        },
                    },
                });
                if (residents.length !== residentIds.length) {
                    throw new common_1.BadRequestException('Một hoặc nhiều cư dân không tồn tại');
                }
                await this.prisma.donateResident.createMany({
                    data: residentIds.map((residentId) => ({
                        donateId: id,
                        residentId,
                        status: 'pending',
                    })),
                });
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.donateResident.deleteMany({
            where: { donateId: id },
        });
        await this.prisma.donate.delete({
            where: { id },
        });
        return { message: `Donate with ID ${id} has been deleted successfully` };
    }
    async addResident(donateId, addResidentDto) {
        await this.findOne(donateId);
        const resident = await this.prisma.resident.findUnique({
            where: { id: addResidentDto.residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${addResidentDto.residentId} not found`);
        }
        const existing = await this.prisma.donateResident.findUnique({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId: addResidentDto.residentId,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Cư dân đã được thêm vào quyên góp này');
        }
        const donateResident = await this.prisma.donateResident.create({
            data: {
                donateId,
                residentId: addResidentDto.residentId,
                status: addResidentDto.status || 'pending',
            },
            include: {
                donate: {
                    include: {
                        residents: {
                            include: {
                                resident: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
                    },
                },
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
        return this.mapDonateResidentToResponseDto(donateResident);
    }
    async removeResident(donateId, residentId) {
        const donateResident = await this.prisma.donateResident.findUnique({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
        });
        if (!donateResident) {
            throw new common_1.NotFoundException('Cư dân không tham gia quyên góp này');
        }
        await this.prisma.donateResident.delete({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
        });
        return {
            message: `Resident has been removed from donate successfully`,
        };
    }
    async updateResidentStatus(donateId, residentId, updateDto) {
        const existing = await this.prisma.donateResident.findUnique({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Cư dân không tham gia quyên góp này');
        }
        const updateData = {};
        if (updateDto.status !== undefined)
            updateData.status = updateDto.status;
        const donateResident = await this.prisma.donateResident.update({
            where: {
                donateId_residentId: {
                    donateId,
                    residentId,
                },
            },
            data: updateData,
            include: {
                donate: {
                    include: {
                        residents: {
                            include: {
                                resident: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
                    },
                },
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
        return this.mapDonateResidentToResponseDto(donateResident);
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
                donate: {
                    include: {
                        residents: {
                            include: {
                                resident: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        email: true,
                                        phone: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                donate: {
                    createdAt: 'desc',
                },
            },
        });
        return donateResidents.map((dr) => this.mapToResponseDto(dr.donate));
    }
    mapToResponseDto(donate) {
        return {
            id: donate.id,
            money: donate.money,
            name: donate.name,
            description: donate.description,
            createdAt: donate.createdAt,
            residents: donate.residents?.map((dr) => this.mapDonateResidentToResponseDto(dr)),
        };
    }
    mapDonateResidentToResponseDto(donateResident) {
        return {
            donateId: donateResident.donateId,
            residentId: donateResident.residentId,
            status: donateResident.status,
            donate: donateResident.donate
                ? this.mapToResponseDto(donateResident.donate)
                : undefined,
            resident: donateResident.resident,
        };
    }
};
exports.DonateService = DonateService;
exports.DonateService = DonateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DonateService);
//# sourceMappingURL=donate.service.js.map