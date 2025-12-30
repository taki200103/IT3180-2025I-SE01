import { DonateresidentService } from './donateresident.service';
import { CreateDonateResidentDto, UpdateDonateResidentDto, DonateResidentResponseDto } from './donateresident.dto';
export declare class DonateresidentController {
    private readonly donateresidentService;
    constructor(donateresidentService: DonateresidentService);
    create(createDonateResidentDto: CreateDonateResidentDto): Promise<DonateResidentResponseDto>;
    findAll(): Promise<DonateResidentResponseDto[]>;
    getAllByDonateId(donateId: string): Promise<DonateResidentResponseDto[]>;
    getAllByResidentId(residentId: string): Promise<DonateResidentResponseDto[]>;
    findOne(donateId: string, residentId: string): Promise<DonateResidentResponseDto>;
    update(donateId: string, residentId: string, updateDonateResidentDto: UpdateDonateResidentDto): Promise<DonateResidentResponseDto>;
    remove(donateId: string, residentId: string): Promise<{
        message: string;
    }>;
}
