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
exports.UpdateApartmentDto = exports.CreateApartmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateApartmentDto {
    name;
    contractStartDate;
    contractEndDate;
    ownerId;
    area;
}
exports.CreateApartmentDto = CreateApartmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the apartment',
        example: 'A101',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contract start date',
        example: '2024-01-01T00:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApartmentDto.prototype, "contractStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contract end date',
        example: '2025-12-31T23:59:59Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApartmentDto.prototype, "contractEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Owner ID',
        example: 'uuid-here',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApartmentDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Area of the apartment in square meters',
        example: 50.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateApartmentDto.prototype, "area", void 0);
class UpdateApartmentDto {
    name;
    contractStartDate;
    contractEndDate;
    ownerId;
    area;
}
exports.UpdateApartmentDto = UpdateApartmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the apartment',
        example: 'A101',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApartmentDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contract start date',
        example: '2024-01-01T00:00:00Z',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApartmentDto.prototype, "contractStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contract end date',
        example: '2025-12-31T23:59:59Z',
        required: false,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApartmentDto.prototype, "contractEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Owner ID',
        example: 'uuid-here',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApartmentDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Area of the apartment in square meters',
        example: 50.5,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateApartmentDto.prototype, "area", void 0);
//# sourceMappingURL=apartment.dto.js.map