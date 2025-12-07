/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInvoiceDto } from '../models/CreateInvoiceDto';
import type { InvoiceResponseDto } from '../models/InvoiceResponseDto';
import type { UpdateInvoiceDto } from '../models/UpdateInvoiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoicesService {
    /**
     * Tạo hóa đơn mới
     * @param requestBody
     * @returns InvoiceResponseDto Hóa đơn đã được tạo thành công
     * @throws ApiError
     */
    public static invoiceControllerCreate(
        requestBody: CreateInvoiceDto,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invoices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Service hoặc Resident không tồn tại`,
            },
        });
    }
    /**
     * Lấy tất cả hóa đơn
     * @returns InvoiceResponseDto Danh sách tất cả hóa đơn
     * @throws ApiError
     */
    public static invoiceControllerFindAll(): CancelablePromise<Array<InvoiceResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoices',
        });
    }
    /**
     * Lấy tất cả hóa đơn theo Resident ID
     * @param residentId ID của cư dân
     * @returns InvoiceResponseDto Danh sách hóa đơn của cư dân
     * @throws ApiError
     */
    public static invoiceControllerGetAllByResidentId(
        residentId: string,
    ): CancelablePromise<Array<InvoiceResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoices/resident/{residentId}',
            path: {
                'residentId': residentId,
            },
            errors: {
                404: `Resident không tồn tại`,
            },
        });
    }
    /**
     * Lấy tất cả hóa đơn theo Service ID
     * @param serviceId ID của khoản thu
     * @returns InvoiceResponseDto Danh sách hóa đơn của khoản thu
     * @throws ApiError
     */
    public static invoiceControllerGetAllByServiceId(
        serviceId: string,
    ): CancelablePromise<Array<InvoiceResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoices/service/{serviceId}',
            path: {
                'serviceId': serviceId,
            },
            errors: {
                404: `Service không tồn tại`,
            },
        });
    }
    /**
     * Lấy chi tiết một hóa đơn
     * @param id ID của hóa đơn
     * @returns InvoiceResponseDto Chi tiết hóa đơn
     * @throws ApiError
     */
    public static invoiceControllerFindOne(
        id: string,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
    /**
     * Cập nhật hóa đơn
     * @param id ID của hóa đơn
     * @param requestBody
     * @returns InvoiceResponseDto Hóa đơn đã được cập nhật
     * @throws ApiError
     */
    public static invoiceControllerUpdate(
        id: string,
        requestBody: UpdateInvoiceDto,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
    /**
     * Xóa hóa đơn
     * @param id ID của hóa đơn
     * @returns any Hóa đơn đã được xóa
     * @throws ApiError
     */
    public static invoiceControllerRemove(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/invoices/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
    /**
     * Thanh toán hóa đơn
     * @param id ID của hóa đơn
     * @returns InvoiceResponseDto Hóa đơn đã được thanh toán thành công
     * @throws ApiError
     */
    public static invoiceControllerPayInvoice(
        id: string,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invoices/{id}/pay',
            path: {
                'id': id,
            },
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
    /**
     * Duyệt hóa đơn (kế toán)
     * @param id ID của hóa đơn
     * @returns InvoiceResponseDto Hóa đơn đã được duyệt thành công
     * @throws ApiError
     */
    public static invoiceControllerApproveInvoice(
        id: string,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invoices/{id}/approve',
            path: {
                'id': id,
            },
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
    /**
     * Từ chối hóa đơn (kế toán)
     * @param id ID của hóa đơn
     * @returns InvoiceResponseDto Hóa đơn đã bị từ chối
     * @throws ApiError
     */
    public static invoiceControllerRejectInvoice(
        id: string,
    ): CancelablePromise<InvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invoices/{id}/reject',
            path: {
                'id': id,
            },
            errors: {
                404: `Hóa đơn không tồn tại`,
            },
        });
    }
}
