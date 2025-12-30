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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoiceService = class InvoiceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateElectricityCost(kWh) {
        let total = 0;
        let remaining = kWh;
        if (remaining > 0) {
            const tier1 = Math.min(remaining, 50);
            total += tier1 * 1984;
            remaining -= tier1;
        }
        if (remaining > 0) {
            const tier2 = Math.min(remaining, 50);
            total += tier2 * 2050;
            remaining -= tier2;
        }
        if (remaining > 0) {
            const tier3 = Math.min(remaining, 100);
            total += tier3 * 2380;
            remaining -= tier3;
        }
        if (remaining > 0) {
            const tier4 = Math.min(remaining, 100);
            total += tier4 * 2998;
            remaining -= tier4;
        }
        if (remaining > 0) {
            const tier5 = Math.min(remaining, 100);
            total += tier5 * 3350;
            remaining -= tier5;
        }
        if (remaining > 0) {
            total += remaining * 3460;
        }
        return total;
    }
    async calculateAmount(serviceId, residentId, createInvoiceDto) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
            include: { apartment: true },
        });
        if (!resident || !resident.apartment) {
            throw new common_1.BadRequestException('Resident phải có căn hộ để tính phí');
        }
        const apartment = resident.apartment;
        switch (serviceId) {
            case 1:
                return 13000 * apartment.area;
            case 2:
                return 7000 * apartment.area;
            case 3:
                if (!createInvoiceDto.money || createInvoiceDto.money <= 0) {
                    throw new common_1.BadRequestException('Phí khác yêu cầu nhập số tiền');
                }
                return Number(createInvoiceDto.money);
            case 4:
                if (!createInvoiceDto.kWh || createInvoiceDto.kWh < 0) {
                    throw new common_1.BadRequestException('Phí điện yêu cầu nhập số kWh');
                }
                return this.calculateElectricityCost(Number(createInvoiceDto.kWh));
            case 5:
                if (!createInvoiceDto.waterM3 || createInvoiceDto.waterM3 < 0) {
                    throw new common_1.BadRequestException('Phí nước yêu cầu nhập số m³');
                }
                return Number(createInvoiceDto.waterM3) * 10000;
            case 6:
                return 200000;
            default:
                if (!createInvoiceDto.money || createInvoiceDto.money <= 0) {
                    throw new common_1.BadRequestException('Service này yêu cầu nhập số tiền');
                }
                return Number(createInvoiceDto.money);
        }
    }
    async create(createInvoiceDto) {
        const service = await this.prisma.service.findUnique({
            where: { id: createInvoiceDto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${createInvoiceDto.serviceId} not found`);
        }
        const resident = await this.prisma.resident.findUnique({
            where: { id: createInvoiceDto.residentId },
            include: { apartment: true },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${createInvoiceDto.residentId} not found`);
        }
        const ownerOnlyServices = [1, 2, 3, 4, 5, 6];
        if (ownerOnlyServices.includes(createInvoiceDto.serviceId)) {
            if (!resident.apartment) {
                throw new common_1.BadRequestException('Resident phải có căn hộ để tạo hóa đơn cho loại phí này');
            }
            if (resident.id !== resident.apartment.ownerId) {
                throw new common_1.BadRequestException('Chỉ chủ căn hộ (owner) mới được tạo hóa đơn cho loại phí này');
            }
        }
        const calculatedAmount = await this.calculateAmount(createInvoiceDto.serviceId, createInvoiceDto.residentId, createInvoiceDto);
        const invoice = await this.prisma.invoice.create({
            data: {
                serviceId: createInvoiceDto.serviceId,
                residentId: createInvoiceDto.residentId,
                name: createInvoiceDto.name,
                money: calculatedAmount,
            },
            include: {
                service: true,
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
        return invoice;
    }
    async findAll() {
        return this.prisma.invoice.findMany({
            include: {
                service: true,
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
                createdAt: 'desc',
            },
        });
    }
    async getAllByResidentId(residentId) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${residentId} not found`);
        }
        const invoices = await this.prisma.invoice.findMany({
            where: {
                residentId: residentId,
            },
            include: {
                service: true,
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
                createdAt: 'desc',
            },
        });
        return invoices;
    }
    async getAllByServiceId(serviceId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${serviceId} not found`);
        }
        const invoices = await this.prisma.invoice.findMany({
            where: {
                serviceId: serviceId,
            },
            include: {
                service: true,
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
                createdAt: 'desc',
            },
        });
        return invoices;
    }
    async findOne(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                service: true,
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
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        return invoice;
    }
    async update(id, updateInvoiceDto) {
        await this.findOne(id);
        const invoice = await this.prisma.invoice.update({
            where: { id },
            data: updateInvoiceDto,
            include: {
                service: true,
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
        return invoice;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.invoice.delete({
            where: { id },
        });
        return { message: `Invoice with ID ${id} has been deleted successfully` };
    }
    async payInvoice(id) {
        await this.findOne(id);
        await this.prisma.invoice.update({
            where: { id },
            data: { status: 'pending' },
        });
        return this.findOne(id);
    }
    async approveInvoice(id) {
        await this.findOne(id);
        await this.prisma.invoice.update({
            where: { id },
            data: { status: 'paid' },
        });
        return this.findOne(id);
    }
    async rejectInvoice(id) {
        await this.findOne(id);
        await this.prisma.invoice.update({
            where: { id },
            data: { status: 'unpaid' },
        });
        return this.findOne(id);
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map