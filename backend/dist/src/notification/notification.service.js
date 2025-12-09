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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const notification = await this.prisma.notification.create({
            data: {
                info: data.info,
                creator: data.creator,
            },
        });
        let targetResidents;
        if (data.residentIds && data.residentIds.length > 0) {
            targetResidents = await this.prisma.resident.findMany({
                where: {
                    id: { in: data.residentIds },
                },
                select: { id: true },
            });
        }
        else {
            targetResidents = await this.prisma.resident.findMany({
                select: { id: true },
            });
        }
        if (targetResidents.length > 0) {
            await this.prisma.residentNotification.createMany({
                data: targetResidents.map((resident) => ({
                    notificationId: notification.id,
                    residentId: resident.id,
                })),
                skipDuplicates: true,
            });
        }
        return this.prisma.notification.findUnique({
            where: { id: notification.id },
            include: { residents: true },
        });
    }
    findAll() {
        return this.prisma.notification.findMany({
            include: { residents: true },
        });
    }
    findOne(id) {
        return this.prisma.notification.findUnique({
            where: { id },
            include: { residents: true },
        });
    }
    update(id, data) {
        return this.prisma.notification.update({ where: { id }, data });
    }
    remove(id) {
        return this.prisma.notification.delete({ where: { id } });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map