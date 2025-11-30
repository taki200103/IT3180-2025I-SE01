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
exports.UpdateServiceDto = exports.CreateServiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateServiceDto {
    month;
    totalAmount;
    status;
    rentAmount;
    serviceAmount;
    sanitationAmount;
    parkingAmount;
    electricityAmount;
    waterAmount;
    housingAmount;
}
exports.CreateServiceDto = CreateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-10', description: 'Tháng (YYYY-MM)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, description: 'Tổng số tiền' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'unpaid',
        description: 'Trạng thái: paid hoặc unpaid',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['paid', 'unpaid']),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateServiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000000, description: 'Phí thuê', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "rentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí dịch vụ', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "serviceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300000, description: 'Phí vệ sinh', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "sanitationAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí gửi xe', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "parkingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000, description: 'Phí điện', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "electricityAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí nước', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "waterAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200000, description: 'Phí nhà ở', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateServiceDto.prototype, "housingAmount", void 0);
class UpdateServiceDto {
    month;
    totalAmount;
    status;
    rentAmount;
    serviceAmount;
    sanitationAmount;
    parkingAmount;
    electricityAmount;
    waterAmount;
    housingAmount;
}
exports.UpdateServiceDto = UpdateServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-10',
        description: 'Tháng (YYYY-MM)',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5000000,
        description: 'Tổng số tiền',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'paid',
        description: 'Trạng thái: paid hoặc unpaid',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['paid', 'unpaid']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateServiceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2000000, description: 'Phí thuê', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "rentAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí dịch vụ', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "serviceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300000, description: 'Phí vệ sinh', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "sanitationAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí gửi xe', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "parkingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000, description: 'Phí điện', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "electricityAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500000, description: 'Phí nước', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "waterAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200000, description: 'Phí nhà ở', required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateServiceDto.prototype, "housingAmount", void 0);
//# sourceMappingURL=service.dto.js.map