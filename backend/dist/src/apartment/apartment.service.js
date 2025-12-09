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
exports.ApartmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ApartmentService = class ApartmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.apartment.create({
            data: {
                name: data.name,
                contractStartDate: new Date(data.contractStartDate),
                contractEndDate: new Date(data.contractEndDate),
                ownerId: data.ownerId,
                area: data.area,
            },
            include: { residents: true },
        });
    }
    findAll() {
        return this.prisma.apartment.findMany({
            include: { residents: true },
            orderBy: { name: 'asc' },
        });
    }
    findOne(id) {
        return this.prisma.apartment.findUnique({
            where: { id },
            include: { residents: true },
        });
    }
    update(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.contractStartDate !== undefined) {
            updateData.contractStartDate = new Date(data.contractStartDate);
        }
        if (data.contractEndDate !== undefined) {
            updateData.contractEndDate = new Date(data.contractEndDate);
        }
        if (data.ownerId !== undefined)
            updateData.ownerId = data.ownerId;
        if (data.area !== undefined)
            updateData.area = data.area;
        return this.prisma.apartment.update({
            where: { id },
            data: updateData,
            include: { residents: true },
        });
    }
    remove(id) {
        return this.prisma.apartment.delete({ where: { id } });
    }
};
exports.ApartmentService = ApartmentService;
exports.ApartmentService = ApartmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApartmentService);
//# sourceMappingURL=apartment.service.js.map