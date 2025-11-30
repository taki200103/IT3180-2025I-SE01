/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApartmentDto } from '../models/CreateApartmentDto';
import type { UpdateApartmentDto } from '../models/UpdateApartmentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApartmentsService {
    /**
     * Create new apartment
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static apartmentControllerCreate(
        requestBody: CreateApartmentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/apartments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all apartments
     * @returns any
     * @throws ApiError
     */
    public static apartmentControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/apartments',
        });
    }
    /**
     * Get apartment by ID
     * @param id Apartment ID
     * @returns any
     * @throws ApiError
     */
    public static apartmentControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/apartments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update apartment
     * @param id Apartment ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static apartmentControllerUpdate(
        id: string,
        requestBody: UpdateApartmentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/apartments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete apartment
     * @param id Apartment ID
     * @returns any
     * @throws ApiError
     */
    public static apartmentControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/apartments/{id}',
            path: {
                'id': id,
            },
        });
    }
}
