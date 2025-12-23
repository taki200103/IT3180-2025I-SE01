import { ShiftService } from './shift.service';
import { CreateShiftDto, UpdateShiftDto } from './shift.dto';
export declare class ShiftController {
    private readonly service;
    constructor(service: ShiftService);
    create(data: CreateShiftDto): Promise<{
        guard: {
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
        guardId: string;
    }>;
    findAll(startDate?: string, endDate?: string): Promise<({
        guard: {
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
        guardId: string;
    })[]>;
    getGuardList(): Promise<{
        id: string;
        fullName: string;
        phone: string;
        email: string;
    }[]>;
    findOne(id: string): Promise<{
        guard: {
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
        guardId: string;
    }>;
    update(id: string, data: UpdateShiftDto): Promise<{
        guard: {
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
        guardId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        shiftType: string;
        guardId: string;
    }>;
}
