/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type CreateDonateDto = {
  money: number;
  name: string;
  description?: string;
  residentIds?: string[];
};

export type UpdateDonateDto = {
  money?: number;
  name?: string;
  description?: string;
  residentIds?: string[];
};

export type DonateResponseDto = {
  id: string;
  money: number;
  name: string;
  description?: string;
  createdAt: string;
  residents?: DonateResidentResponseDto[];
};

export type DonateResidentResponseDto = {
  donateId: string;
  residentId: string;
  status: string;
  donate?: DonateResponseDto;
  resident?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
};

export class DonatesService {
  /**
   * Tạo quyên góp mới
   * @param requestBody
   * @returns DonateResponseDto Quyên góp đã được tạo thành công
   * @throws ApiError
   */
  public static donateControllerCreate(
    requestBody: CreateDonateDto,
  ): CancelablePromise<DonateResponseDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/donates',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Donate hoặc Resident không tồn tại`,
      },
    });
  }

  /**
   * Lấy tất cả quyên góp
   * @returns DonateResponseDto Danh sách tất cả quyên góp
   * @throws ApiError
   */
  public static donateControllerFindAll(): CancelablePromise<Array<DonateResponseDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donates',
    });
  }

  /**
   * Lấy tất cả quyên góp theo Resident ID
   * @param residentId ID của cư dân
   * @returns DonateResponseDto Danh sách quyên góp của cư dân
   * @throws ApiError
   */
  public static donateControllerGetAllByResidentId(
    residentId: string,
  ): CancelablePromise<Array<DonateResponseDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donates/resident/{residentId}',
      path: {
        'residentId': residentId,
      },
      errors: {
        404: `Resident không tồn tại`,
      },
    });
  }

  /**
   * Lấy chi tiết một quyên góp
   * @param id ID của quyên góp
   * @returns DonateResponseDto Chi tiết quyên góp
   * @throws ApiError
   */
  public static donateControllerFindOne(
    id: string,
  ): CancelablePromise<DonateResponseDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donates/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `Quyên góp không tồn tại`,
      },
    });
  }

  /**
   * Cập nhật quyên góp
   * @param id ID của quyên góp
   * @param requestBody
   * @returns DonateResponseDto Quyên góp đã được cập nhật
   * @throws ApiError
   */
  public static donateControllerUpdate(
    id: string,
    requestBody: UpdateDonateDto,
  ): CancelablePromise<DonateResponseDto> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/donates/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Quyên góp không tồn tại`,
      },
    });
  }

  /**
   * Xóa quyên góp
   * @param id ID của quyên góp
   * @returns any Quyên góp đã được xóa
   * @throws ApiError
   */
  public static donateControllerRemove(
    id: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/donates/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `Quyên góp không tồn tại`,
      },
    });
  }

  /**
   * Thêm cư dân vào quyên góp
   * @param id ID của quyên góp
   * @param requestBody
   * @returns DonateResidentResponseDto Cư dân đã được thêm vào quyên góp
   * @throws ApiError
   */
  public static donateControllerAddResident(
    id: string,
    requestBody: { residentId: string; status?: string },
  ): CancelablePromise<DonateResidentResponseDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/donates/{id}/residents',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Quyên góp hoặc cư dân không tồn tại`,
      },
    });
  }

  /**
   * Xóa cư dân khỏi quyên góp
   * @param id ID của quyên góp
   * @param residentId ID của cư dân
   * @returns any Cư dân đã được xóa khỏi quyên góp
   * @throws ApiError
   */
  public static donateControllerRemoveResident(
    id: string,
    residentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/donates/{id}/residents/{residentId}',
      path: {
        'id': id,
        'residentId': residentId,
      },
      errors: {
        404: `Quan hệ không tồn tại`,
      },
    });
  }

  /**
   * Cập nhật trạng thái của cư dân trong quyên góp
   * @param id ID của quyên góp
   * @param residentId ID của cư dân
   * @param requestBody
   * @returns DonateResidentResponseDto Trạng thái đã được cập nhật
   * @throws ApiError
   */
  public static donateControllerUpdateResidentStatus(
    id: string,
    residentId: string,
    requestBody: { status?: string },
  ): CancelablePromise<DonateResidentResponseDto> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/donates/{id}/residents/{residentId}/status',
      path: {
        'id': id,
        'residentId': residentId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Quan hệ không tồn tại`,
      },
    });
  }
}

