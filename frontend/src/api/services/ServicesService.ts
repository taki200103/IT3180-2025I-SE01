/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateServiceDto } from '../models/CreateServiceDto';
import type { UpdateServiceDto } from '../models/UpdateServiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ServicesService {
    /**
     * Create new service
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceControllerCreate(
        requestBody: CreateServiceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/services',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all services
     * @returns any
     * @throws ApiError
     */
    public static serviceControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/services',
        });
    }
    /**
     * Get service by ID
     * @param id Service ID
     * @returns any
     * @throws ApiError
     */
    public static serviceControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/services/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update service
     * @param id Service ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static serviceControllerUpdate(
        id: string,
        requestBody: UpdateServiceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/services/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete service
     * @param id Service ID
     * @returns any
     * @throws ApiError
     */
    public static serviceControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/services/{id}',
            path: {
                'id': id,
            },
        });
    }
}
