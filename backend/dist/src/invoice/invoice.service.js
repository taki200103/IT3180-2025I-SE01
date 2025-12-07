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
        await this.ensureStatusColumnExists();
        const createdInvoice = await this.prisma.invoice.create({
            data: createInvoiceDto,
        });
        return this.findOne(createdInvoice.id);
    }
    async findAll() {
        await this.ensureStatusColumnExists();
        const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      ORDER BY i."CreateDate" DESC
    `);
        return invoices.map((invoice) => ({
            id: invoice.id,
            createdAt: invoice.createdAt,
            serviceId: invoice.serviceId,
            residentId: invoice.residentId,
            name: invoice.name,
            money: parseFloat(invoice.money),
            status: invoice.status || 'unpaid',
            service: invoice.service,
            resident: invoice.resident,
        }));
    }
    async getAllByResidentId(residentId) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
        });
        if (!resident) {
            throw new common_1.NotFoundException(`Resident with ID ${residentId} not found`);
        }
        await this.ensureStatusColumnExists();
        const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_resident" = '${residentId}'
      ORDER BY i."CreateDate" DESC
    `);
        return invoices.map((invoice) => ({
            id: invoice.id,
            createdAt: invoice.createdAt,
            serviceId: invoice.serviceId,
            residentId: invoice.residentId,
            name: invoice.name,
            money: parseFloat(invoice.money),
            status: invoice.status || 'unpaid',
            service: invoice.service,
            resident: invoice.resident,
        }));
    }
    async getAllByServiceId(serviceId) {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${serviceId} not found`);
        }
        await this.ensureStatusColumnExists();
        const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_service" = ${serviceId}
      ORDER BY i."CreateDate" DESC
    `);
        return invoices.map((invoice) => ({
            id: invoice.id,
            createdAt: invoice.createdAt,
            serviceId: invoice.serviceId,
            residentId: invoice.residentId,
            name: invoice.name,
            money: parseFloat(invoice.money),
            status: invoice.status || 'unpaid',
            service: invoice.service,
            resident: invoice.resident,
        }));
    }
    async findOne(id) {
        await this.ensureStatusColumnExists();
        const invoices = await this.prisma.$queryRawUnsafe(`
      SELECT 
        i."ID_invoice" as id,
        i."CreateDate" as "createdAt",
        i."ID_service" as "serviceId",
        i."ID_resident" as "residentId",
        i."Name" as name,
        i."Money" as money,
        COALESCE(i.status, 'unpaid') as status,
        json_build_object(
          'id', s."ID_khoan_thu",
          'name', s.name,
          'month', s.month,
          'totalAmount', s."totalAmount",
          'status', s.status,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) as service,
        json_build_object(
          'id', r."ID_Resident",
          'fullName', r.name,
          'email', r.email,
          'phone', r.phone
        ) as resident
      FROM invoices i
      LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
      LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
      WHERE i."ID_invoice" = '${id}'
    `);
        if (invoices.length === 0) {
            throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
        }
        const invoice = invoices[0];
        return {
            id: invoice.id,
            createdAt: invoice.createdAt,
            serviceId: invoice.serviceId,
            residentId: invoice.residentId,
            name: invoice.name,
            money: parseFloat(invoice.money),
            status: invoice.status || 'unpaid',
            service: invoice.service,
            resident: invoice.resident,
        };
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
        const existingInvoice = await this.findOne(id);
        try {
            await this.ensureStatusColumnExists();
            await this.prisma.$executeRawUnsafe(`UPDATE invoices SET status = 'pending' WHERE "ID_invoice" = '${id}'`);
            const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `);
            if (updatedInvoice.length === 0) {
                throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
            }
            const invoice = updatedInvoice[0];
            return {
                id: invoice.id,
                createdAt: invoice.createdAt,
                serviceId: invoice.serviceId,
                residentId: invoice.residentId,
                name: invoice.name,
                money: parseFloat(invoice.money),
                status: invoice.status || 'pending',
                service: invoice.service,
                resident: invoice.resident,
            };
        }
        catch (error) {
            console.error('Error updating invoice status:', error);
            throw new common_1.NotFoundException(`Failed to update invoice status: ${error.message}`);
        }
    }
    async ensureStatusColumnExists() {
        try {
            const result = await this.prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'invoices' AND column_name = 'status'
      `);
            if (result.length === 0) {
                await this.prisma.$executeRawUnsafe(`
          ALTER TABLE invoices 
          ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'unpaid'
        `);
                console.log('Status column added to invoices table');
            }
        }
        catch (error) {
            console.error('Error ensuring status column exists:', error);
        }
    }
    async approveInvoice(id) {
        await this.findOne(id);
        try {
            await this.ensureStatusColumnExists();
            await this.prisma.$executeRawUnsafe(`UPDATE invoices SET status = 'paid' WHERE "ID_invoice" = '${id}'`);
            const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `);
            if (updatedInvoice.length === 0) {
                throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
            }
            const invoice = updatedInvoice[0];
            return {
                id: invoice.id,
                createdAt: invoice.createdAt,
                serviceId: invoice.serviceId,
                residentId: invoice.residentId,
                name: invoice.name,
                money: parseFloat(invoice.money),
                status: invoice.status || 'paid',
                service: invoice.service,
                resident: invoice.resident,
            };
        }
        catch (error) {
            console.error('Error approving invoice:', error);
            throw new common_1.NotFoundException(`Failed to approve invoice: ${error.message}`);
        }
    }
    async rejectInvoice(id) {
        await this.findOne(id);
        try {
            await this.ensureStatusColumnExists();
            await this.prisma.$executeRawUnsafe(`UPDATE invoices SET status = 'unpaid' WHERE "ID_invoice" = '${id}'`);
            const updatedInvoice = await this.prisma.$queryRawUnsafe(`
        SELECT 
          i."ID_invoice" as id,
          i."CreateDate" as "createdAt",
          i."ID_service" as "serviceId",
          i."ID_resident" as "residentId",
          i."Name" as name,
          i."Money" as money,
          i.status,
          json_build_object(
            'id', s."ID_khoan_thu",
            'name', s.name,
            'month', s.month,
            'totalAmount', s."totalAmount",
            'status', s.status,
            'createdAt', s."createdAt",
            'updatedAt', s."updatedAt"
          ) as service,
          json_build_object(
            'id', r."ID_Resident",
            'fullName', r.name,
            'email', r.email,
            'phone', r.phone
          ) as resident
        FROM invoices i
        LEFT JOIN services s ON i."ID_service" = s."ID_khoan_thu"
        LEFT JOIN residents r ON i."ID_resident" = r."ID_Resident"
        WHERE i."ID_invoice" = '${id}'
      `);
            if (updatedInvoice.length === 0) {
                throw new common_1.NotFoundException(`Invoice with ID ${id} not found`);
            }
            const invoice = updatedInvoice[0];
            return {
                id: invoice.id,
                createdAt: invoice.createdAt,
                serviceId: invoice.serviceId,
                residentId: invoice.residentId,
                name: invoice.name,
                money: parseFloat(invoice.money),
                status: invoice.status || 'unpaid',
                service: invoice.service,
                resident: invoice.resident,
            };
        }
        catch (error) {
            console.error('Error rejecting invoice:', error);
            throw new common_1.NotFoundException(`Failed to reject invoice: ${error.message}`);
        }
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map