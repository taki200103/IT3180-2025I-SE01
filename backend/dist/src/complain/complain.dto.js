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
exports.UpdateComplainDto = exports.CreateComplainDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateComplainDto {
    residentId;
    title;
    message;
    responseText;
    status;
    targetRole;
}
exports.CreateComplainDto = CreateComplainDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the resident making the complaint',
        example: 'uuid-here',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "residentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the complaint',
        example: 'Vấn đề về hệ thống nước',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message content of the complaint',
        example: 'Nước bị tắc nghẽn ở tầng 3',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Initial response from admin (optional)',
        example: 'Đã ghi nhận yêu cầu',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "responseText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the complaint',
        example: 'pending',
        required: false,
        default: 'pending',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target role that should receive/handle this complaint',
        example: 'admin',
        required: false,
        default: 'admin',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateComplainDto.prototype, "targetRole", void 0);
class UpdateComplainDto {
    title;
    message;
    responseText;
    status;
    targetRole;
}
exports.UpdateComplainDto = UpdateComplainDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the complaint',
        example: 'Vấn đề về hệ thống nước',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateComplainDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message content of the complaint',
        example: 'Nước bị tắc nghẽn ở tầng 3',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateComplainDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Response text from admin',
        example: 'Đã xử lý xong',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateComplainDto.prototype, "responseText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the complaint',
        example: 'resolved',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateComplainDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Target role that should receive/handle this complaint',
        example: 'admin',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateComplainDto.prototype, "targetRole", void 0);
//# sourceMappingURL=complain.dto.js.map