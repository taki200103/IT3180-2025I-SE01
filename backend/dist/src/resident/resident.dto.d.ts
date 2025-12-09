export declare class CreateResidentDto {
    apartmentId?: string;
    fullName: string;
    phone: string;
    password: string;
    email: string;
    role?: string;
    temporaryStatus?: boolean;
    idNumber: string;
    birthDate: string;
}
export declare class UpdateResidentDto {
    apartmentId?: string;
    fullName?: string;
    phone?: string;
    password?: string;
    email?: string;
    role?: string;
    temporaryStatus?: boolean;
    idNumber?: string;
    birthDate?: string;
}
