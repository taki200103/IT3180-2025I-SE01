"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const apartment_module_1 = require("./apartment/apartment.module");
const prisma_module_1 = require("./prisma/prisma.module");
const resident_module_1 = require("./resident/resident.module");
const notification_module_1 = require("./notification/notification.module");
const service_module_1 = require("./service/service.module");
const auth_controller_1 = require("./auth/auth.controller");
const auth_module_1 = require("./auth/auth.module");
const invoice_module_1 = require("./invoice/invoice.module");
const residentnotification_module_1 = require("./residentnotification/residentnotification.module");
const complain_module_1 = require("./complain/complain.module");
const shift_module_1 = require("./shift/shift.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            apartment_module_1.ApartmentModule,
            prisma_module_1.PrismaModule,
            resident_module_1.ResidentModule,
            notification_module_1.NotificationModule,
            service_module_1.ServiceModule,
            auth_module_1.AuthModule,
            invoice_module_1.InvoiceModule,
            residentnotification_module_1.ResidentnotificationModule,
            complain_module_1.ComplainModule,
            shift_module_1.ShiftModule,
        ],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map