export declare class CreateInvoiceDto {
    serviceId: number;
    residentId: string;
    name: string;
    money: number;
}
declare const UpdateInvoiceDto_base: import("@nestjs/common").Type<Partial<CreateInvoiceDto>>;
export declare class UpdateInvoiceDto extends UpdateInvoiceDto_base {
}
export declare class InvoiceResponseDto {
    id: string;
    createdAt: Date;
    serviceId: number;
    residentId: string;
    name: string;
    money: number;
    status?: string;
    service?: {
        id: number;
        name: string;
        month: string;
        totalAmount: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    };
    resident?: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
}
export {};
