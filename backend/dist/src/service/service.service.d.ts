import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
export declare class ServiceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        month: string;
        totalAmount: number;
        status: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        month: string;
        totalAmount: number;
        status: string;
        updatedAt: Date;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ServiceClient<({
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        month: string;
        totalAmount: number;
        status: string;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            name: string;
            id: string;
            createdAt: Date;
            serviceId: number;
            residentId: string;
            money: number;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        month: string;
        totalAmount: number;
        status: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        name: string;
        id: number;
        createdAt: Date;
        month: string;
        totalAmount: number;
        status: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
