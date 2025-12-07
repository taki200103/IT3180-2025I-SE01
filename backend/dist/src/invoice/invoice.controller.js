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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoice_service_1 = require("./invoice.service");
const jwt_auth_guard_1 = require("../system/guards/jwt-auth.guard");
const invoice_dtos_1 = require("./invoice.dtos");
let InvoiceController = class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    create(createInvoiceDto) {
        return this.invoiceService.create(createInvoiceDto);
    }
    findAll() {
        return this.invoiceService.findAll();
    }
    getAllByResidentId(residentId) {
        return this.invoiceService.getAllByResidentId(residentId);
    }
    getAllByServiceId(serviceId) {
        return this.invoiceService.getAllByServiceId(parseInt(serviceId, 10));
    }
    findOne(id) {
        return this.invoiceService.findOne(id);
    }
    update(id, updateInvoiceDto) {
        return this.invoiceService.update(id, updateInvoiceDto);
    }
    remove(id) {
        return this.invoiceService.remove(id);
    }
    payInvoice(id) {
        return this.invoiceService.payInvoice(id);
    }
    approveInvoice(id) {
        return this.invoiceService.approveInvoice(id);
    }
    rejectInvoice(id) {
        return this.invoiceService.rejectInvoice(id);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo hóa đơn mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Hóa đơn đã được tạo thành công',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Service hoặc Resident không tồn tại',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_dtos_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách tất cả hóa đơn',
        type: [invoice_dtos_1.InvoiceResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('resident/:residentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả hóa đơn theo Resident ID' }),
    (0, swagger_1.ApiParam)({ name: 'residentId', description: 'ID của cư dân' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách hóa đơn của cư dân',
        type: [invoice_dtos_1.InvoiceResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Resident không tồn tại' }),
    __param(0, (0, common_1.Param)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getAllByResidentId", null);
__decorate([
    (0, common_1.Get)('service/:serviceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy tất cả hóa đơn theo Service ID' }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'ID của khoản thu' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách hóa đơn của khoản thu',
        type: [invoice_dtos_1.InvoiceResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Service không tồn tại' }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getAllByServiceId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chi tiết một hóa đơn' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chi tiết hóa đơn',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật hóa đơn' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hóa đơn đã được cập nhật',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invoice_dtos_1.UpdateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa hóa đơn' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hóa đơn đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Thanh toán hóa đơn (chuyển sang chờ duyệt)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hóa đơn đã được gửi chờ duyệt',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "payInvoice", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Duyệt hóa đơn (kế toán)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hóa đơn đã được duyệt thành công',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "approveInvoice", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Từ chối hóa đơn (kế toán)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của hóa đơn' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Hóa đơn đã bị từ chối',
        type: invoice_dtos_1.InvoiceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Hóa đơn không tồn tại' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "rejectInvoice", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map