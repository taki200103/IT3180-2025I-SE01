export declare enum ShiftType {
    MORNING = "morning",
    AFTERNOON = "afternoon",
    NIGHT = "night"
}
export declare class CreateShiftDto {
    date: string;
    shiftType: ShiftType;
    policeId: string;
}
export declare class UpdateShiftDto {
    date?: string;
    shiftType?: ShiftType;
    policeId?: string;
}
export declare class ShiftResponseDto {
    id: string;
    date: Date;
    shiftType: string;
    policeId: string;
    police?: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
