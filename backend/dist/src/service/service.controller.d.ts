import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
export declare class ServiceController {
    private readonly service;
    constructor(service: ServiceService);
    create(data: CreateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            name: string;
            id: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        month: string;
        totalAmount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        invoices: {
            name: string;
            id: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        month: string;
        totalAmount: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ServiceClient<({
        invoices: {
            name: string;
            id: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        month: string;
        totalAmount: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            name: string;
            id: string;
            residentId: string;
            createdAt: Date;
            serviceId: number;
            money: number;
            status: string;
        }[];
    } & {
        name: string;
        id: number;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        month: string;
        totalAmount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        name: string;
        id: number;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        month: string;
        totalAmount: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
