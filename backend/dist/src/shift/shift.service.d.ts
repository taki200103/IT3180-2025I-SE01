import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto, UpdateShiftDto } from './shift.dto';
export declare class ShiftService {
    private prisma;
    constructor(prisma: PrismaService);
    private get db();
    create(data: CreateShiftDto): Promise<{
        police: {
            id: string;
            fullName: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        policeId: string;
    }>;
    findAll(startDate?: string, endDate?: string): Promise<({
        police: {
            id: string;
            fullName: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        policeId: string;
    })[]>;
    findOne(id: string): Promise<{
        police: {
            id: string;
            fullName: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        policeId: string;
    }>;
    update(id: string, data: UpdateShiftDto): Promise<{
        police: {
            id: string;
            fullName: string;
            phone: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        policeId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        policeId: string;
    }>;
    getPoliceList(): Promise<{
        id: string;
        fullName: string;
        phone: string;
        email: string;
    }[]>;
}
