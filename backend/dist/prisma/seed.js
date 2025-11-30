"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Bắt đầu seed dữ liệu...');
    await prisma.residentNotification.deleteMany();
    await prisma.complain.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.service.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.resident.deleteMany();
    await prisma.apartment.deleteMany();
    console.log('✅ Đã xóa dữ liệu cũ');
    const plainPassword = '123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const tempApartments = await Promise.all([
        prisma.apartment.create({
            data: {
                name: 'A101',
                contractStartDate: new Date('2023-01-01'),
                contractEndDate: new Date('2025-12-31'),
                ownerId: 'temp-owner-001',
                area: 75.5,
            },
        }),
        prisma.apartment.create({
            data: {
                name: 'A102',
                contractStartDate: new Date('2023-03-15'),
                contractEndDate: new Date('2026-03-14'),
                ownerId: 'temp-owner-002',
                area: 85.0,
            },
        }),
        prisma.apartment.create({
            data: {
                name: 'A201',
                contractStartDate: new Date('2023-06-01'),
                contractEndDate: new Date('2025-05-31'),
                ownerId: 'temp-owner-003',
                area: 95.5,
            },
        }),
        prisma.apartment.create({
            data: {
                name: 'A202',
                contractStartDate: new Date('2023-02-10'),
                contractEndDate: new Date('2026-02-09'),
                ownerId: 'temp-owner-004',
                area: 80.0,
            },
        }),
    ]);
    const owners = await Promise.all([
        prisma.resident.create({
            data: {
                apartmentId: tempApartments[0].id,
                fullName: 'Nguyễn Văn An',
                phone: '0901234567',
                password: hashedPassword,
                email: 'nguyenvanan@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567890',
                birthDate: new Date('1985-03-15'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: tempApartments[1].id,
                fullName: 'Trần Thị Bình',
                phone: '0901234568',
                password: hashedPassword,
                email: 'tranthibinh@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567891',
                birthDate: new Date('1987-06-20'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: tempApartments[2].id,
                fullName: 'Lê Minh Cường',
                phone: '0901234569',
                password: hashedPassword,
                email: 'leminhcuong@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567892',
                birthDate: new Date('1990-11-10'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: tempApartments[3].id,
                fullName: 'Phạm Thu Dung',
                phone: '0901234570',
                password: hashedPassword,
                email: 'phamthudung@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567893',
                birthDate: new Date('1992-08-25'),
            },
        }),
    ]);
    console.log(`✅ Đã tạo ${owners.length} chủ căn hộ`);
    const apartments = await Promise.all(tempApartments.map((apt, index) => prisma.apartment.update({
        where: { id: apt.id },
        data: { ownerId: owners[index].id },
    })));
    console.log(`✅ Đã cập nhật ownerId cho ${apartments.length} căn hộ`);
    const additionalResidents = await Promise.all([
        prisma.resident.create({
            data: {
                apartmentId: apartments[0].id,
                fullName: 'Nguyễn Thị Mai',
                phone: '0901234578',
                password: hashedPassword,
                email: 'nguyenthimai@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567901',
                birthDate: new Date('1990-05-20'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[0].id,
                fullName: 'Nguyễn Văn Hùng',
                phone: '0901234579',
                password: hashedPassword,
                email: 'nguyenvanhung@gmail.com',
                role: 'resident',
                temporaryStatus: true,
                idNumber: '001234567902',
                birthDate: new Date('1995-08-15'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[1].id,
                fullName: 'Trần Văn Đức',
                phone: '0901234580',
                password: hashedPassword,
                email: 'tranvanduc@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567903',
                birthDate: new Date('1992-03-10'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[1].id,
                fullName: 'Trần Thị Lan',
                phone: '0901234581',
                password: hashedPassword,
                email: 'tranthilan@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567904',
                birthDate: new Date('1994-11-25'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[1].id,
                fullName: 'Trần Văn Phúc',
                phone: '0901234582',
                password: hashedPassword,
                email: 'tranvanphuc@gmail.com',
                role: 'resident',
                temporaryStatus: true,
                idNumber: '001234567905',
                birthDate: new Date('1998-07-08'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[2].id,
                fullName: 'Lê Thị Hoa',
                phone: '0901234583',
                password: hashedPassword,
                email: 'lethihoa@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567906',
                birthDate: new Date('1991-09-12'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[2].id,
                fullName: 'Lê Văn Nam',
                phone: '0901234584',
                password: hashedPassword,
                email: 'levannam@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567907',
                birthDate: new Date('1993-04-20'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[3].id,
                fullName: 'Phạm Văn Khoa',
                phone: '0901234585',
                password: hashedPassword,
                email: 'phamvankhoa@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567908',
                birthDate: new Date('1989-12-05'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[3].id,
                fullName: 'Phạm Thị Oanh',
                phone: '0901234586',
                password: hashedPassword,
                email: 'phamthioanh@gmail.com',
                role: 'resident',
                temporaryStatus: true,
                idNumber: '001234567909',
                birthDate: new Date('1996-06-18'),
            },
        }),
        prisma.resident.create({
            data: {
                apartmentId: apartments[3].id,
                fullName: 'Phạm Văn Đạt',
                phone: '0901234587',
                password: hashedPassword,
                email: 'phamvandat@gmail.com',
                role: 'resident',
                temporaryStatus: false,
                idNumber: '001234567910',
                birthDate: new Date('1997-03-22'),
            },
        }),
    ]);
    const residents = [...owners, ...additionalResidents];
    console.log(`✅ Đã tạo thêm ${additionalResidents.length} cư dân`);
    console.log(`✅ Tổng cộng ${residents.length} cư dân (${owners.length} chủ căn hộ + ${additionalResidents.length} cư dân khác)`);
    const services = await Promise.all([
        prisma.service.create({
            data: {
                month: '2024-09',
                totalAmount: 5500000,
                status: 'paid',
                rentAmount: 3000000,
                serviceAmount: 500000,
                sanitationAmount: 200000,
                parkingAmount: 300000,
                electricityAmount: 800000,
                waterAmount: 400000,
                housingAmount: 300000,
            },
        }),
        prisma.service.create({
            data: {
                month: '2024-10',
                totalAmount: 5800000,
                status: 'paid',
                rentAmount: 3000000,
                serviceAmount: 500000,
                sanitationAmount: 200000,
                parkingAmount: 300000,
                electricityAmount: 1000000,
                waterAmount: 450000,
                housingAmount: 350000,
            },
        }),
        prisma.service.create({
            data: {
                month: '2024-11',
                totalAmount: 5600000,
                status: 'unpaid',
                rentAmount: 3000000,
                serviceAmount: 500000,
                sanitationAmount: 200000,
                parkingAmount: 300000,
                electricityAmount: 900000,
                waterAmount: 400000,
                housingAmount: 300000,
            },
        }),
    ]);
    console.log(`✅ Đã tạo ${services.length} khoản thu`);
    const invoices = [];
    for (const service of services) {
        for (let i = 0; i < Math.min(5, residents.length); i++) {
            const invoice = await prisma.invoice.create({
                data: {
                    serviceId: service.id,
                    residentId: residents[i].id,
                    name: `Hóa đơn tháng ${service.month} - ${residents[i].fullName}`,
                    money: service.totalAmount / apartments.length,
                },
            });
            invoices.push(invoice);
        }
    }
    console.log(`✅ Đã tạo ${invoices.length} hóa đơn`);
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                info: 'Thông báo bảo trì hệ thống điện vào ngày 15/12/2024. Vui lòng chuẩn bị nguồn điện dự phòng.',
                creator: 'Ban Quản Lý',
            },
        }),
        prisma.notification.create({
            data: {
                info: 'Thông báo tăng phí gửi xe từ tháng 12/2024. Chi tiết xem tại văn phòng quản lý.',
                creator: 'Ban Quản Lý',
            },
        }),
        prisma.notification.create({
            data: {
                info: 'Lịch cắt nước định kỳ vào thứ 7 tuần này từ 8h-12h để vệ sinh bể nước.',
                creator: 'Ban Quản Lý',
            },
        }),
        prisma.notification.create({
            data: {
                info: 'Thông báo tổ chức họp cư dân vào 20h ngày 25/12/2024 tại hội trường tầng 1.',
                creator: 'Ban Quản Lý',
            },
        }),
        prisma.notification.create({
            data: {
                info: 'Nhắc nhở cư dân giữ gìn vệ sinh chung, không xả rác bừa bãi.',
                creator: 'Ban Quản Lý',
            },
        }),
    ]);
    console.log(`✅ Đã tạo ${notifications.length} thông báo`);
    const residentNotifications = [];
    for (const notification of notifications) {
        for (let i = 0; i < Math.min(8, residents.length); i++) {
            const resNotif = await prisma.residentNotification.create({
                data: {
                    notificationId: notification.id,
                    residentId: residents[i].id,
                },
            });
            residentNotifications.push(resNotif);
        }
    }
    console.log(`✅ Đã tạo ${residentNotifications.length} liên kết thông báo-cư dân`);
    const complains = await Promise.all([
        prisma.complain.create({
            data: {
                residentId: residents[0].id,
                title: 'Thang máy tầng 2 bị hỏng',
                message: 'Thang máy tầng 2 không hoạt động từ 3 ngày nay, rất bất tiện cho cư dân.',
                status: 'resolved',
                responseText: 'Đã liên hệ đội kỹ thuật sửa chữa. Thang máy đã hoạt động trở lại.',
            },
        }),
        prisma.complain.create({
            data: {
                residentId: residents[1].id,
                title: 'Tiếng ồn vào ban đêm',
                message: 'Căn hộ bên cạnh thường xuyên gây ồn vào ban đêm, ảnh hưởng đến giấc ngủ.',
                status: 'in_progress',
                responseText: 'Đã nhắc nhở cư dân căn hộ liên quan. Sẽ tiếp tục theo dõi.',
            },
        }),
        prisma.complain.create({
            data: {
                residentId: residents[2].id,
                title: 'Rò rỉ nước tại hành lang tầng 3',
                message: 'Phát hiện rò rỉ nước tại hành lang tầng 3, cần khắc phục gấp.',
                status: 'pending',
            },
        }),
        prisma.complain.create({
            data: {
                residentId: residents[3].id,
                title: 'Đèn hành lang tầng 1 không sáng',
                message: 'Đèn hành lang tầng 1 đã hỏng từ tuần trước, ban đêm rất tối.',
                status: 'resolved',
                responseText: 'Đã thay bóng đèn mới.',
            },
        }),
        prisma.complain.create({
            data: {
                residentId: residents[4].id,
                title: 'Yêu cầu thêm chỗ đậu xe',
                message: 'Chỗ đậu xe không đủ, đề nghị ban quản lý mở rộng khu vực gửi xe.',
                status: 'pending',
            },
        }),
        prisma.complain.create({
            data: {
                residentId: residents[5].id,
                title: 'Wifi khu vực công cộng yếu',
                message: 'Tín hiệu wifi tại khu vực sảnh rất yếu, không sử dụng được.',
                status: 'in_progress',
                responseText: 'Đang kiểm tra hệ thống router và sẽ nâng cấp thiết bị.',
            },
        }),
    ]);
    console.log(`✅ Đã tạo ${complains.length} khiếu nại`);
    console.log('\n🎉 Hoàn thành seed dữ liệu demo!');
    console.log('\n📊 Tổng kết:');
    console.log(`   - ${apartments.length} căn hộ`);
    console.log(`   - ${residents.length} cư dân`);
    console.log(`   - ${services.length} khoản thu`);
    console.log(`   - ${invoices.length} hóa đơn`);
    console.log(`   - ${notifications.length} thông báo`);
    console.log(`   - ${residentNotifications.length} liên kết thông báo`);
    console.log(`   - ${complains.length} khiếu nại`);
    console.log('\n🔑 Thông tin đăng nhập:');
    console.log('   Email: nguyenvanan@gmail.com');
    console.log('   Password: 123');
}
main()
    .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map