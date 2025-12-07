import { ResidentService } from './resident.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
export declare class ResidentController {
    private readonly service;
    constructor(service: ResidentService);
    create(data: CreateResidentDto): Promise<{
        apartment: {
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
            id: string;
        } | null;
        notifications: {
            residentId: string;
            notificationId: string;
        }[];
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            residentId: string;
            message: string;
            responseText: string | null;
        }[];
    } & {
        id: string;
        apartmentId: string | null;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        apartment: {
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
            id: string;
        } | null;
        notifications: {
            residentId: string;
            notificationId: string;
        }[];
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            residentId: string;
            message: string;
            responseText: string | null;
        }[];
    } & {
        id: string;
        apartmentId: string | null;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ResidentClient<({
        apartment: {
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
            id: string;
        } | null;
        notifications: {
            residentId: string;
            notificationId: string;
        }[];
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            residentId: string;
            message: string;
            responseText: string | null;
        }[];
    } & {
        id: string;
        apartmentId: string | null;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateResidentDto): Promise<{
        apartment: {
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
            id: string;
        } | null;
        notifications: {
            residentId: string;
            notificationId: string;
        }[];
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
        complains: {
            title: string;
            id: string;
            createdAt: Date;
            status: string;
            updatedAt: Date;
            residentId: string;
            message: string;
            responseText: string | null;
        }[];
    } & {
        id: string;
        apartmentId: string | null;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
    }>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ResidentClient<{
        id: string;
        apartmentId: string | null;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
