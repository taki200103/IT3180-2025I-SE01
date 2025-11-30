/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNotificationDto } from '../models/CreateNotificationDto';
import type { UpdateNotificationDto } from '../models/UpdateNotificationDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Create new notification
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerCreate(
        requestBody: CreateNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all notifications
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerFindAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications',
        });
    }
    /**
     * Get notification by ID
     * @param id Notification ID
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/notifications/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update notification
     * @param id Notification ID
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerUpdate(
        id: string,
        requestBody: UpdateNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/notifications/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete notification
     * @param id Notification ID
     * @returns any
     * @throws ApiError
     */
    public static notificationControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/notifications/{id}',
            path: {
                'id': id,
            },
        });
    }
}
