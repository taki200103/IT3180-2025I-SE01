import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type CreateShiftDto = {
  date: string;
  shiftType: 'morning' | 'afternoon' | 'night';
  policeId: string;
};

export type UpdateShiftDto = {
  policeId?: string;
};

export type ShiftResponseDto = {
  id: string;
  date: string;
  shiftType: string;
  policeId: string;
  police?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
};

export class ShiftsService {
  public static shiftControllerCreate(
    requestBody: CreateShiftDto,
  ): CancelablePromise<ShiftResponseDto> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/shifts',
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  public static shiftControllerFindAll(
    startDate?: string,
    endDate?: string,
  ): CancelablePromise<ShiftResponseDto[]> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/shifts',
      query: {
        startDate,
        endDate,
      },
    });
  }

  public static shiftControllerGetPoliceList(): CancelablePromise<
    Array<{
      id: string;
      fullName: string;
      email: string;
      phone: string;
    }>
  > {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/shifts/police',
    });
  }

  public static shiftControllerFindOne(id: string): CancelablePromise<ShiftResponseDto> {
    return __request(OpenAPI, {
      method: 'GET',
      url: `/shifts/${id}`,
    });
  }

  public static shiftControllerUpdate(
    id: string,
    requestBody: UpdateShiftDto,
  ): CancelablePromise<ShiftResponseDto> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: `/shifts/${id}`,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  public static shiftControllerRemove(id: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `/shifts/${id}`,
    });
  }
}

