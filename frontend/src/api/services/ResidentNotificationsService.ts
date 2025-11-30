/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ResidentNotificationsService {
    /**
     * Lấy thông báo theo ID resident
     * @param residentId
     * @returns any
     * @throws ApiError
     */
    public static residentnotificationControllerGetNotificationsByResident(
        residentId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/resident-notifications/by-resident',
            query: {
                'residentId': residentId,
            },
        });
    }
    /**
     * Lấy danh sách resident theo ID thông báo
     * @param notificationId
     * @returns any
     * @throws ApiError
     */
    public static residentnotificationControllerGetResidentsByNotification(
        notificationId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/resident-notifications/by-notification',
            query: {
                'notificationId': notificationId,
            },
        });
    }
}
