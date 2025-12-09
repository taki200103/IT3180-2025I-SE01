export declare class CreateComplainDto {
    residentId: string;
    title: string;
    message: string;
    responseText?: string;
    status?: string;
    targetRole?: string;
}
export declare class UpdateComplainDto {
    title?: string;
    message?: string;
    responseText?: string;
    status?: string;
    targetRole?: string;
}
