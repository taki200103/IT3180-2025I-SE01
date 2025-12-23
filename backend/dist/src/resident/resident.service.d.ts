import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateResidentDto } from './resident.dto';
export declare class ResidentService {
    private prisma;
    constructor(prisma: PrismaService);
    private calculateAge;
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
    findAll(): Prisma.PrismaPromise<({
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
    findOne(id: string): Prisma.Prisma__ResidentClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
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
}
