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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResidentnotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const residentnotification_service_1 = require("./residentnotification.service");
const residentnotification_dto_1 = require("./residentnotification.dto");
let ResidentnotificationController = class ResidentnotificationController {
    service;
    constructor(service) {
        this.service = service;
    }
    getNotificationsByResident(dto) {
        return this.service.getNotificationsByResident(dto.residentId);
    }
    getResidentsByNotification(dto) {
        return this.service.getResidentsByNotification(dto.notificationId);
    }
};
exports.ResidentnotificationController = ResidentnotificationController;
__decorate([
    (0, common_1.Get)('by-resident'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông báo theo ID resident' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [residentnotification_dto_1.GetNotificationsByResidentDto]),
    __metadata("design:returntype", Promise)
], ResidentnotificationController.prototype, "getNotificationsByResident", null);
__decorate([
    (0, common_1.Get)('by-notification'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách resident theo ID thông báo' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [residentnotification_dto_1.GetResidentsByNotificationDto]),
    __metadata("design:returntype", Promise)
], ResidentnotificationController.prototype, "getResidentsByNotification", null);
exports.ResidentnotificationController = ResidentnotificationController = __decorate([
    (0, swagger_1.ApiTags)('Resident Notifications'),
    (0, common_1.Controller)('resident-notifications'),
    __metadata("design:paramtypes", [residentnotification_service_1.ResidentnotificationService])
], ResidentnotificationController);
//# sourceMappingURL=residentnotification.controller.js.map