import { ResidentService } from './resident.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
export declare class ResidentController {
    private readonly service;
    constructor(service: ResidentService);
    create(data: CreateResidentDto): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ResidentClient<({
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateResidentDto): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }>;
    approve(id: string): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }>;
    toggleTemporaryStatus(id: string): Promise<{
        apartment: {
            id: string;
            name: string;
            contractStartDate: Date;
            contractEndDate: Date;
            ownerId: string;
            area: number;
        } | null;
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
            status: string;
        }[];
        complains: {
            id: string;
            residentId: string;
            createdAt: Date;
            status: string;
            title: string;
            responseText: string | null;
            message: string;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        fullName: string;
        phone: string;
        password: string;
        email: string;
        role: string;
        temporaryStatus: boolean;
        idNumber: string;
        birthDate: Date;
        approved: boolean;
        apartmentId: string | null;
    }>;
}
