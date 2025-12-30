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
exports.DonateresidentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const donateresident_service_1 = require("./donateresident.service");
const jwt_auth_guard_1 = require("../system/guards/jwt-auth.guard");
const donateresident_dto_1 = require("./donateresident.dto");
let DonateresidentController = class DonateresidentController {
    donateresidentService;
    constructor(donateresidentService) {
        this.donateresidentService = donateresidentService;
    }
    create(createDonateResidentDto) {
        return this.donateresidentService.create(createDonateResidentDto);
    }
    findAll() {
        return this.donateresidentService.findAll();
    }
    getAllByDonateId(donateId) {
        return this.donateresidentService.getAllByDonateId(donateId);
    }
    getAllByResidentId(residentId) {
        return this.donateresidentService.getAllByResidentId(residentId);
    }
    findOne(donateId, residentId) {
        return this.donateresidentService.findOne(donateId, residentId);
    }
    update(donateId, residentId, updateDonateResidentDto) {
        return this.donateresidentService.update(donateId, residentId, updateDonateResidentDto);
    }
    remove(donateId, residentId) {
        return this.donateresidentService.remove(donateId, residentId);
    }
};
exports.DonateresidentController = DonateresidentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo quan hệ donate-resident mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quan hệ đã được tạo thành công',
        type: donateresident_dto_1.DonateResidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Donate hoặc Resident không tồn tại',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Quan hệ đã tồn tại',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donateresident_dto_1.CreateDonateResidentDto]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả quan hệ donate-resident' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách tất cả quan hệ',
        type: [donateresident_dto_1.DonateResidentResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('donate/:donateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả quan hệ theo Donate ID' }),
    (0, swagger_1.ApiParam)({ name: 'donateId', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách quan hệ của quyên góp',
        type: [donateresident_dto_1.DonateResidentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Donate không tồn tại' }),
    __param(0, (0, common_1.Param)('donateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "getAllByDonateId", null);
__decorate([
    (0, common_1.Get)('resident/:residentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả quan hệ theo Resident ID' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách quan hệ của cư dân',
        type: [donateresident_dto_1.DonateResidentResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Resident không tồn tại' }),
    __param(0, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "getAllByResidentId", null);
__decorate([
    (0, common_1.Get)(':donateId/:residentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết một quan hệ donate-resident' }),
    (0, swagger_1.ApiParam)({ name: 'donateId', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chi tiết quan hệ',
        type: donateresident_dto_1.DonateResidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quan hệ không tồn tại' }),
    __param(0, (0, common_1.Param)('donateId')),
    __param(1, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':donateId/:residentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật quan hệ donate-resident' }),
    (0, swagger_1.ApiParam)({ name: 'donateId', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quan hệ đã được cập nhật',
        type: donateresident_dto_1.DonateResidentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quan hệ không tồn tại' }),
    __param(0, (0, common_1.Param)('donateId')),
    __param(1, (0, common_1.Param)('residentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, donateresident_dto_1.UpdateDonateResidentDto]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':donateId/:residentId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa quan hệ donate-resident' }),
    (0, swagger_1.ApiParam)({ name: 'donateId', description: 'ID của quyên góp' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quan hệ đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quan hệ không tồn tại' }),
    __param(0, (0, common_1.Param)('donateId')),
    __param(1, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DonateresidentController.prototype, "remove", null);
exports.DonateresidentController = DonateresidentController = __decorate([
    (0, swagger_1.ApiTags)('DonateResidents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('donate-residents'),
    __metadata("design:paramtypes", [donateresident_service_1.DonateresidentService])
], DonateresidentController);
//# sourceMappingURL=donateresident.controller.js.map