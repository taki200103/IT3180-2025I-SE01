export declare class CreateDonateResidentDto {
    donateId: string;
    residentId: string;
    status?: string;
}
export declare class UpdateDonateResidentDto {
    status?: string;
}
export declare class DonateResidentResponseDto {
    donateId: string;
    residentId: string;
    status: string;
    donate?: {
        id: string;
        money: number;
        name: string;
        description?: string;
        createdAt: Date;
    };
    resident?: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
}
