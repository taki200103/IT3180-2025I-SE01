import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
export declare class ResidentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateResidentDto): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        };
        notifications: {
            notificationId: string;
            residentId: string;
        }[];
        invoices: {
            id: string;
            name: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            residentId: string;
            createdAt: Date;
            responseText: string | null;
            message: string;
            status: string;
            updatedAt: Date;
        }[];
    } & {
        apartmentId: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        id: string;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        };
        notifications: {
            notificationId: string;
            residentId: string;
        }[];
        invoices: {
            id: string;
            name: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            residentId: string;
            createdAt: Date;
            responseText: string | null;
            message: string;
            status: string;
            updatedAt: Date;
        }[];
    } & {
        apartmentId: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        id: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ResidentClient<({
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        };
        notifications: {
            notificationId: string;
            residentId: string;
        }[];
        invoices: {
            id: string;
            name: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            residentId: string;
            createdAt: Date;
            responseText: string | null;
            message: string;
            status: string;
            updatedAt: Date;
        }[];
    } & {
        apartmentId: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        id: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateResidentDto): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        };
        notifications: {
            notificationId: string;
            residentId: string;
        }[];
        invoices: {
            id: string;
            name: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            residentId: string;
            createdAt: Date;
            responseText: string | null;
            message: string;
            status: string;
            updatedAt: Date;
        }[];
    } & {
        apartmentId: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        id: string;
    }>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ResidentClient<{
        apartmentId: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        id: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
