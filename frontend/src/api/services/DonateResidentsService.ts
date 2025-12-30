/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type CreateDonateResidentDto = {
  donateId: string;
  residentId: string;
  status?: string;
};

export type UpdateDonateResidentDto = {
  status?: string;
};

export type DonateResidentResponseDto = {
  donateId: string;
  residentId: string;
  status: string;
  donate?: {
    id: string;
    money: number;
    name: string;
    description?: string;
    createdAt: string;
  };
  resident?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
};

export class DonateResidentsService {
  /**
   * Tạo quan hệ donate-resident mới
   * @param requestBody
   * @returns DonateResidentResponseDto Quan hệ đã được tạo thành công
   * @throws ApiError
   */
  public static donateresidentControllerCreate(
    requestBody: CreateDonateResidentDto,
  ): CancelablePromise<DonateResidentResponseDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/donate-residents',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Donate hoặc Resident không tồn tại`,
      },
    });
  }

  /**
   * Lấy tất cả quan hệ donate-resident
   * @returns DonateResidentResponseDto Danh sách tất cả quan hệ
   * @throws ApiError
   */
  public static donateresidentControllerFindAll(): CancelablePromise<Array<DonateResidentResponseDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donate-residents',
    });
  }

  /**
   * Lấy tất cả quan hệ theo Donate ID
   * @param donateId ID của quyên góp
   * @returns DonateResidentResponseDto Danh sách quan hệ của quyên góp
   * @throws ApiError
   */
  public static donateresidentControllerGetAllByDonateId(
    donateId: string,
  ): CancelablePromise<Array<DonateResidentResponseDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donate-residents/donate/{donateId}',
      path: {
        'donateId': donateId,
      },
      errors: {
        404: `Donate không tồn tại`,
      },
    });
  }

  /**
   * Lấy tất cả quan hệ theo Resident ID
   * @param residentId ID của cư dân
   * @returns DonateResidentResponseDto Danh sách quan hệ của cư dân
   * @throws ApiError
   */
  public static donateresidentControllerGetAllByResidentId(
    residentId: string,
  ): CancelablePromise<Array<DonateResidentResponseDto>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donate-residents/resident/{residentId}',
      path: {
        'residentId': residentId,
      },
      errors: {
        404: `Resident không tồn tại`,
      },
    });
  }

  /**
   * Lấy chi tiết một quan hệ donate-resident
   * @param donateId ID của quyên góp
   * @param residentId ID của cư dân
   * @returns DonateResidentResponseDto Chi tiết quan hệ
   * @throws ApiError
   */
  public static donateresidentControllerFindOne(
    donateId: string,
    residentId: string,
  ): CancelablePromise<DonateResidentResponseDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/donate-residents/{donateId}/{residentId}',
      path: {
        'donateId': donateId,
        'residentId': residentId,
      },
      errors: {
        404: `Quan hệ không tồn tại`,
      },
    });
  }

  /**
   * Cập nhật quan hệ donate-resident
   * @param donateId ID của quyên góp
   * @param residentId ID của cư dân
   * @param requestBody
   * @returns DonateResidentResponseDto Quan hệ đã được cập nhật
   * @throws ApiError
   */
  public static donateresidentControllerUpdate(
    donateId: string,
    residentId: string,
    requestBody: UpdateDonateResidentDto,
  ): CancelablePromise<DonateResidentResponseDto> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/donate-residents/{donateId}/{residentId}',
      path: {
        'donateId': donateId,
        'residentId': residentId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `Quan hệ không tồn tại`,
      },
    });
  }

  /**
   * Xóa quan hệ donate-resident
   * @param donateId ID của quyên góp
   * @param residentId ID của cư dân
   * @returns any Quan hệ đã được xóa
   * @throws ApiError
   */
  public static donateresidentControllerRemove(
    donateId: string,
    residentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/donate-residents/{donateId}/{residentId}',
      path: {
        'donateId': donateId,
        'residentId': residentId,
      },
      errors: {
        404: `Quan hệ không tồn tại`,
      },
    });
  }
}

