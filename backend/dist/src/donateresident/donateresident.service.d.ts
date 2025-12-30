import { PrismaService } from '../prisma/prisma.service';
import { CreateDonateResidentDto, UpdateDonateResidentDto, DonateResidentResponseDto } from './donateresident.dto';
export declare class DonateresidentService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDonateResidentDto: CreateDonateResidentDto): Promise<DonateResidentResponseDto>;
    findAll(): Promise<DonateResidentResponseDto[]>;
    findOne(donateId: string, residentId: string): Promise<DonateResidentResponseDto>;
    update(donateId: string, residentId: string, updateDonateResidentDto: UpdateDonateResidentDto): Promise<DonateResidentResponseDto>;
    remove(donateId: string, residentId: string): Promise<{
        message: string;
    }>;
    getAllByDonateId(donateId: string): Promise<DonateResidentResponseDto[]>;
    getAllByResidentId(residentId: string): Promise<DonateResidentResponseDto[]>;
    private mapToResponseDto;
}
