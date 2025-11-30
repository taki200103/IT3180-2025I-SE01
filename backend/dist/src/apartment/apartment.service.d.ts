import { PrismaService } from '../prisma/prisma.service';
import { CreateApartmentDto, UpdateApartmentDto } from './apartment.dto';
export declare class ApartmentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateApartmentDto): import("@prisma/client").Prisma.Prisma__ApartmentClient<{
        residents: {
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
        }[];
    } & {
        id: string;
        name: string;
        contractStartDate: Date;
        contractEndDate: Date;
        ownerId: string;
        area: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        residents: {
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
        }[];
    } & {
        id: string;
        name: string;
        contractStartDate: Date;
        contractEndDate: Date;
        ownerId: string;
        area: number;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ApartmentClient<({
        residents: {
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
        }[];
    } & {
        id: string;
        name: string;
        contractStartDate: Date;
        contractEndDate: Date;
        ownerId: string;
        area: number;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: UpdateApartmentDto): import("@prisma/client").Prisma.Prisma__ApartmentClient<{
        residents: {
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
        }[];
    } & {
        id: string;
        name: string;
        contractStartDate: Date;
        contractEndDate: Date;
        ownerId: string;
        area: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ApartmentClient<{
        id: string;
        name: string;
        contractStartDate: Date;
        contractEndDate: Date;
        ownerId: string;
        area: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
