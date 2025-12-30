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
exports.DonateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const donate_service_1 = require("./donate.service");
const jwt_auth_guard_1 = require("../system/guards/jwt-auth.guard");
const donate_dto_1 = require("./donate.dto");
let DonateController = class DonateController {
    donateService;
    constructor(donateService) {
        this.donateService = donateService;
    }
    create(createDonateDto) {
        return this.donateService.create(createDonateDto);
    }
    findAll() {
        return this.donateService.findAll();
    }
    getAllByResidentId(residentId) {
        return this.donateService.getAllByResidentId(residentId);
    }
    findOne(id) {
        return this.donateService.findOne(id);
    }
    update(id, updateDonateDto) {
        return this.donateService.update(id, updateDonateDto);
    }
    remove(id) {
        return this.donateService.remove(id);
    }
    addResident(donateId, addResidentDto) {
        return this.donateService.addResident(donateId, addResidentDto);
    }
    removeResident(donateId, residentId) {
        return this.donateService.removeResident(donateId, residentId);
    }
    updateResidentStatus(donateId, residentId, updateDto) {
        return this.donateService.updateResidentStatus(donateId, residentId, updateDto);
    }
};
exports.DonateController = DonateController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo quyên góp mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quyên góp đã được tạo thành công',
        type: donate_dto_1.DonateResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donate_dto_1.CreateDonateDto]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả quyên góp' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách tất cả quyên góp',
        type: [donate_dto_1.DonateResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resident/:residentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả quyên góp theo Resident ID' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách quyên góp của cư dân',
        type: [donate_dto_1.DonateResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Resident không tồn tại' }),
    __param(0, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "getAllByResidentId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết một quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chi tiết quyên góp',
        type: donate_dto_1.DonateResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quyên góp không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quyên góp đã được cập nhật',
        type: donate_dto_1.DonateResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quyên góp không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donate_dto_1.UpdateDonateDto]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quyên góp đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quyên góp không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/residents'),
    (0, swagger_1.ApiOperation)({ summary: 'Thêm cư dân vào quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Cư dân đã được thêm vào quyên góp',
        type: donate_dto_1.DonateResidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quyên góp hoặc cư dân không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, donate_dto_1.AddResidentToDonateDto]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "addResident", null);
__decorate([
    (0, common_1.Delete)(':id/residents/:residentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa cư dân khỏi quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cư dân đã được xóa khỏi quyên góp' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quan hệ không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "removeResident", null);
__decorate([
    (0, common_1.Patch)(':id/residents/:residentId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật trạng thái của cư dân trong quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trạng thái đã được cập nhật',
        type: donate_dto_1.DonateResidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quan hệ không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('residentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, donate_dto_1.UpdateDonateResidentDto]),
    __metadata("design:returntype", Promise)
], DonateController.prototype, "updateResidentStatus", null);
exports.DonateController = DonateController = __decorate([
    (0, swagger_1.ApiTags)('Donates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('donates'),
    __metadata("design:paramtypes", [donate_service_1.DonateService])
], DonateController);
//# sourceMappingURL=donate.controller.js.map