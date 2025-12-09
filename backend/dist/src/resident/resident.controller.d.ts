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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
    }>;
    approve(id: string): Promise<{
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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
    }>;
    toggleTemporaryStatus(id: string): Promise<{
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
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
        complains: {
            title: string;
            id: string;
            message: string;
            residentId: string;
            createdAt: Date;
            status: string;
            responseText: string | null;
            targetRole: string;
            updatedAt: Date;
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
        approved: boolean;
    }>;
    remove(id: string): Promise<{
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
        approved: boolean;
    }>;
}
