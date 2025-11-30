export declare class CreateServiceDto {
    month: string;
    totalAmount: number;
    status: string;
    rentAmount?: number;
    serviceAmount?: number;
    sanitationAmount?: number;
    parkingAmount?: number;
    electricityAmount?: number;
    waterAmount?: number;
    housingAmount?: number;
}
export declare class UpdateServiceDto {
    month?: string;
    totalAmount?: number;
    status?: string;
    rentAmount?: number;
    serviceAmount?: number;
    sanitationAmount?: number;
    parkingAmount?: number;
    electricityAmount?: number;
    waterAmount?: number;
    housingAmount?: number;
}
