import { PrismaService } from '../prisma/prisma.service';
import { CreateDonateDto, UpdateDonateDto, DonateResponseDto, AddResidentToDonateDto, UpdateDonateResidentDto, DonateResidentResponseDto } from './donate.dto';
export declare class DonateService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDonateDto: CreateDonateDto): Promise<DonateResponseDto>;
    findAll(): Promise<DonateResponseDto[]>;
    findOne(id: string): Promise<DonateResponseDto>;
    update(id: string, updateDonateDto: UpdateDonateDto): Promise<DonateResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addResident(donateId: string, addResidentDto: AddResidentToDonateDto): Promise<DonateResidentResponseDto>;
    removeResident(donateId: string, residentId: string): Promise<{
        message: string;
    }>;
    updateResidentStatus(donateId: string, residentId: string, updateDto: UpdateDonateResidentDto): Promise<DonateResidentResponseDto>;
    getAllByResidentId(residentId: string): Promise<DonateResponseDto[]>;
    private mapToResponseDto;
    private mapDonateResidentToResponseDto;
}
