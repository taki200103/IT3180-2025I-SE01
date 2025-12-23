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
            approved: boolean;
        };
    } & {
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
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
            approved: boolean;
        };
    } & {
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
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
            approved: boolean;
        };
    } & {
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
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
            approved: boolean;
        };
    } & {
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
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
            approved: boolean;
        };
    } & {
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        title: string;
        id: string;
        message: string;
        residentId: string;
        createdAt: Date;
        status: string;
        responseText: string | null;
        targetRole: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
