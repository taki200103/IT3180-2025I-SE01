import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
export declare class ServiceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            id: string;
            name: string;
            createdAt: Date;
            money: number;
            serviceId: number;
            residentId: string;
        }[];
    } & {
        id: number;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: number | null;
        serviceAmount: number | null;
        sanitationAmount: number | null;
        parkingAmount: number | null;
        electricityAmount: number | null;
        waterAmount: number | null;
        housingAmount: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        invoices: {
            id: string;
            name: string;
            createdAt: Date;
            money: number;
            serviceId: number;
            residentId: string;
        }[];
    } & {
        id: number;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: number | null;
        serviceAmount: number | null;
        sanitationAmount: number | null;
        parkingAmount: number | null;
        electricityAmount: number | null;
        waterAmount: number | null;
        housingAmount: number | null;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ServiceClient<({
        invoices: {
            id: string;
            name: string;
            createdAt: Date;
            money: number;
            serviceId: number;
            residentId: string;
        }[];
    } & {
        id: number;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: number | null;
        serviceAmount: number | null;
        sanitationAmount: number | null;
        parkingAmount: number | null;
        electricityAmount: number | null;
        waterAmount: number | null;
        housingAmount: number | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateServiceDto): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        invoices: {
            id: string;
            name: string;
            createdAt: Date;
            money: number;
            serviceId: number;
            residentId: string;
        }[];
    } & {
        id: number;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: number | null;
        serviceAmount: number | null;
        sanitationAmount: number | null;
        parkingAmount: number | null;
        electricityAmount: number | null;
        waterAmount: number | null;
        housingAmount: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ServiceClient<{
        id: number;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        rentAmount: number | null;
        serviceAmount: number | null;
        sanitationAmount: number | null;
        parkingAmount: number | null;
        electricityAmount: number | null;
        waterAmount: number | null;
        housingAmount: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
