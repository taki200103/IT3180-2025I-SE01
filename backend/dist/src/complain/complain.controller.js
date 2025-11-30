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
exports.ComplainController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const complain_service_1 = require("./complain.service");
const complain_dto_1 = require("./complain.dto");
const jwt_auth_guard_1 = require("../system/guards/jwt-auth.guard");
let ComplainController = class ComplainController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(data) {
        return this.service.create(data);
    }
    findAll(residentId) {
        if (residentId) {
            return this.service.findByResident(residentId);
        }
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, data) {
        return this.service.update(id, data);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.ComplainController = ComplainController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new complaint' }),
    (0, swagger_1.ApiBody)({ type: complain_dto_1.CreateComplainDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [complain_dto_1.CreateComplainDto]),
    __metadata("design:returntype", void 0)
], ComplainController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all complaints' }),
    (0, swagger_1.ApiQuery)({
        name: 'residentId',
        required: false,
        description: 'Filter by resident ID',
    }),
    __param(0, (0, common_1.Query)('residentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplainController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complaint by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Complaint ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplainController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update complaint (e.g., add response)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Complaint ID' }),
    (0, swagger_1.ApiBody)({ type: complain_dto_1.UpdateComplainDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complain_dto_1.UpdateComplainDto]),
    __metadata("design:returntype", void 0)
], ComplainController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete complaint' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Complaint ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ComplainController.prototype, "remove", null);
exports.ComplainController = ComplainController = __decorate([
    (0, swagger_1.ApiTags)('Complains'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('complains'),
    __metadata("design:paramtypes", [complain_service_1.ComplainService])
], ComplainController);
//# sourceMappingURL=complain.controller.js.map