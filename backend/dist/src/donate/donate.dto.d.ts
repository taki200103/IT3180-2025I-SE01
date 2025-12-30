export declare class CreateDonateDto {
    money: number;
    name: string;
    description?: string;
    residentIds?: string[];
}
declare const UpdateDonateDto_base: import("@nestjs/common").Type<Partial<CreateDonateDto>>;
export declare class UpdateDonateDto extends UpdateDonateDto_base {
}
export declare class DonateResponseDto {
    id: string;
    money: number;
    name: string;
    description?: string;
    createdAt: Date;
    residents?: DonateResidentResponseDto[];
}
export declare class AddResidentToDonateDto {
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
    donate?: DonateResponseDto;
    resident?: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
}
export {};
