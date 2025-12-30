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
exports.DonateResidentResponseDto = exports.UpdateDonateResidentDto = exports.AddResidentToDonateDto = exports.DonateResponseDto = exports.UpdateDonateDto = exports.CreateDonateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDonateDto {
    money;
    name;
    description;
    residentIds;
}
exports.CreateDonateDto = CreateDonateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000000, description: 'Số tiền quyên góp' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateDonateDto.prototype, "money", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quyên góp từ thiện', description: 'Tên quyên góp' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDonateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Quyên góp cho người nghèo',
        description: 'Mô tả quyên góp',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDonateDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['resident-id-1', 'resident-id-2'],
        description: 'Danh sách ID cư dân tham gia quyên góp',
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDonateDto.prototype, "residentIds", void 0);
class UpdateDonateDto extends (0, swagger_1.PartialType)(CreateDonateDto) {
}
exports.UpdateDonateDto = UpdateDonateDto;
class DonateResponseDto {
    id;
    money;
    name;
    description;
    createdAt;
    residents;
}
exports.DonateResponseDto = DonateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DonateResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], DonateResponseDto.prototype, "money", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DonateResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], DonateResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DonateResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Array)
], DonateResponseDto.prototype, "residents", void 0);
class AddResidentToDonateDto {
    residentId;
    status;
}
exports.AddResidentToDonateDto = AddResidentToDonateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'resident-id', description: 'ID của cư dân' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddResidentToDonateDto.prototype, "residentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'pending',
        description: 'Trạng thái',
        required: false,
        default: 'pending',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddResidentToDonateDto.prototype, "status", void 0);
class UpdateDonateResidentDto {
    status;
}
exports.UpdateDonateResidentDto = UpdateDonateResidentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'approved',
        description: 'Trạng thái mới',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDonateResidentDto.prototype, "status", void 0);
class DonateResidentResponseDto {
    donateId;
    residentId;
    status;
    donate;
    resident;
}
exports.DonateResidentResponseDto = DonateResidentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DonateResidentResponseDto.prototype, "donateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DonateResidentResponseDto.prototype, "residentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DonateResidentResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", DonateResponseDto)
], DonateResidentResponseDto.prototype, "donate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Object)
], DonateResidentResponseDto.prototype, "resident", void 0);
//# sourceMappingURL=donate.dto.js.map