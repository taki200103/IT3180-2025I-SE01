import { PrismaService } from '../prisma/prisma.service';
import { CreateComplainDto, UpdateComplainDto } from './complain.dto';
export declare class ComplainService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateComplainDto): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        resident: {
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        resident: {
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    })[]>;
    findByResident(residentId: string): import("@prisma/client").Prisma.PrismaPromise<({
        resident: {
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ComplainClient<({
        resident: {
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateComplainDto): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        resident: {
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
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        title: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        residentId: string;
        message: string;
        responseText: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
