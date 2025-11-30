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
    async create(createInvoiceDto) {
        const service = await this.prisma.service.findUnique({
            where: { id: createInvoiceDto.serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${createInvoiceDto.serviceId} not found`);
        }
        const resident = await this.prisma.resident.findUnique({
            where: { id: createInvoiceDto.residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${createInvoiceDto.residentId} not found`);
        }
        const invoice = await this.prisma.invoice.create({
            data: createInvoiceDto,
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
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map