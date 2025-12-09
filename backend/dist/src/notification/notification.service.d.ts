import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        info: string;
        creator: string;
        residentIds?: string[];
    }): Promise<({
        residents: {
            residentId: string;
            notificationId: string;
        }[];
    } & {
        info: string;
        id: string;
        createdAt: Date;
        creator: string;
    }) | null>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        residents: {
            residentId: string;
            notificationId: string;
        }[];
    } & {
        info: string;
        id: string;
        createdAt: Date;
        creator: string;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__NotificationClient<({
        residents: {
            residentId: string;
            notificationId: string;
        }[];
    } & {
        info: string;
        id: string;
        createdAt: Date;
        creator: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: {
        info?: string;
        creator?: string;
    }): import("@prisma/client").Prisma.Prisma__NotificationClient<{
        info: string;
        id: string;
        createdAt: Date;
        creator: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__NotificationClient<{
        info: string;
        id: string;
        createdAt: Date;
        creator: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
