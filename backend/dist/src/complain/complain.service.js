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
exports.ComplainService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComplainService = class ComplainService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.complain.create({
            data: {
                residentId: data.residentId,
                title: data.title,
                message: data.message,
                responseText: data.responseText,
                status: data.status || 'pending',
                targetRole: data.targetRole || 'admin',
            },
            include: { resident: true },
        });
    }
    findAll() {
        return this.prisma.complain.findMany({
            include: { resident: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    findByResident(residentId) {
        return this.prisma.complain.findMany({
            where: { residentId },
            include: { resident: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id) {
        return this.prisma.complain.findUnique({
            where: { id },
            include: { resident: true },
        });
    }
    update(id, data) {
        return this.prisma.complain.update({
            where: { id },
            data,
            include: { resident: true },
        });
    }
    remove(id) {
        return this.prisma.complain.delete({ where: { id } });
    }
};
exports.ComplainService = ComplainService;
exports.ComplainService = ComplainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplainService);
//# sourceMappingURL=complain.service.js.map