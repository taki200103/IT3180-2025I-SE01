/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateComplainDto = {
    /**
     * ID of the resident making the complaint
     */
    residentId: string;
    /**
     * Title of the complaint
     */
    title: string;
    /**
     * Message content of the complaint
     */
    message: string;
    /**
     * Status of the complaint
     */
    status?: string;
    /**
     * Target role that should receive/handle this complaint
     */
    targetRole?: string;
};

