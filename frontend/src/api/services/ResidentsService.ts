/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateResidentDto } from '../models/CreateResidentDto';
import type { UpdateResidentDto } from '../models/UpdateResidentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ResidentsService {
    /**
     * Create new resident
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static residentControllerCreate(
        requestBody: CreateResidentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/residents',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all residents
     * @returns any
     * @throws ApiError
     */
    public static residentControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/residents',
        });
    }
    /**
     * Get resident by ID
     * @param id Resident ID
     * @returns any
     * @throws ApiError
     */
    public static residentControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update resident
     * @param id Resident ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static residentControllerUpdate(
        id: string,
        requestBody: UpdateResidentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete resident
     * @param id Resident ID
     * @returns any
     * @throws ApiError
     */
    public static residentControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/residents/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Approve resident account
     * @param id Resident ID
     * @returns any
     * @throws ApiError
     */
    public static residentControllerApprove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/residents/{id}/approve',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Toggle temporary status (hoạt động/tạm vắng)
     * @param id Resident ID
     * @returns any
     * @throws ApiError
     */
    public static residentControllerToggleStatus(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/residents/{id}/toggle-status',
            path: {
                'id': id,
            },
        });
    }
}
