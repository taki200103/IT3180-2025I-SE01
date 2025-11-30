import { ComplainService } from './complain.service';
import { CreateComplainDto, UpdateComplainDto } from './complain.dto';
export declare class ComplainController {
    private readonly service;
    constructor(service: ComplainService);
    create(data: CreateComplainDto): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        resident: {
            id: string;
            fullName: string;
            phone: string;
            password: string;
            email: string;
            role: string;
            temporaryStatus: boolean;
            idNumber: string;
            birthDate: Date;
            apartmentId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        residentId: string;
        title: string;
        responseText: string | null;
        message: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(residentId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        resident: {
            id: string;
            fullName: string;
            phone: string;
            password: string;
            email: string;
            role: string;
            temporaryStatus: boolean;
            idNumber: string;
            birthDate: Date;
            apartmentId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        residentId: string;
        title: string;
        responseText: string | null;
        message: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ComplainClient<({
        resident: {
            id: string;
            fullName: string;
            phone: string;
            password: string;
            email: string;
            role: string;
            temporaryStatus: boolean;
            idNumber: string;
            birthDate: Date;
            apartmentId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        residentId: string;
        title: string;
        responseText: string | null;
        message: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateComplainDto): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        resident: {
            id: string;
            fullName: string;
            phone: string;
            password: string;
            email: string;
            role: string;
            temporaryStatus: boolean;
            idNumber: string;
            birthDate: Date;
            apartmentId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        residentId: string;
        title: string;
        responseText: string | null;
        message: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ComplainClient<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        residentId: string;
        title: string;
        responseText: string | null;
        message: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
