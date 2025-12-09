/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateComplainDto } from '../models/CreateComplainDto';
import type { UpdateComplainDto } from '../models/UpdateComplainDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ComplainsService {
    /**
     * Create new complaint
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static complainControllerCreate(
        requestBody: CreateComplainDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/complains',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all complaints
     * @param residentId Filter by resident ID
     * @returns any
     * @throws ApiError
     */
    public static complainControllerFindAll(
        residentId?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/complains',
            query: {
                'residentId': residentId,
            },
        });
    }
    /**
     * Get complaint by ID
     * @param id Complaint ID
     * @returns any
     * @throws ApiError
     */
    public static complainControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/complains/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update complaint (e.g., add response)
     * @param id Complaint ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static complainControllerUpdate(
        id: string,
        requestBody: UpdateComplainDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/complains/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete complaint
     * @param id Complaint ID
     * @returns any
     * @throws ApiError
     */
    public static complainControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/complains/{id}',
            path: {
                'id': id,
            },
        });
    }
}
