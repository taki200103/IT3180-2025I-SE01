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
exports.ShiftResponseDto = exports.UpdateShiftDto = exports.CreateShiftDto = exports.ShiftType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ShiftType;
(function (ShiftType) {
    ShiftType["MORNING"] = "morning";
    ShiftType["AFTERNOON"] = "afternoon";
    ShiftType["NIGHT"] = "night";
})(ShiftType || (exports.ShiftType = ShiftType = {}));
class CreateShiftDto {
    date;
    shiftType;
    policeId;
}
exports.CreateShiftDto = CreateShiftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày trực', example: '2024-12-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại ca trực', enum: ShiftType, example: 'morning' }),
    (0, class_validator_1.IsEnum)(ShiftType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "shiftType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của bảo vệ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "policeId", void 0);
class UpdateShiftDto {
    date;
    shiftType;
    policeId;
}
exports.UpdateShiftDto = UpdateShiftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ngày trực', required: false, example: '2024-12-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Loại ca trực', enum: ShiftType, required: false, example: 'morning' }),
    (0, class_validator_1.IsEnum)(ShiftType),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "shiftType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID của bảo vệ', required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "policeId", void 0);
class ShiftResponseDto {
    id;
    date;
    shiftType;
    policeId;
    police;
    createdAt;
    updatedAt;
}
exports.ShiftResponseDto = ShiftResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ShiftResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ShiftResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ShiftType }),
    __metadata("design:type", String)
], ShiftResponseDto.prototype, "shiftType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ShiftResponseDto.prototype, "policeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ShiftResponseDto.prototype, "police", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ShiftResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ShiftResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=shift.dto.js.map