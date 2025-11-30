/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateServiceDto = {
    /**
     * Tháng (YYYY-MM)
     */
    month: string;
    /**
     * Tổng số tiền
     */
    totalAmount: number;
    /**
     * Trạng thái: paid hoặc unpaid
     */
    status: string;
    /**
     * Phí thuê
     */
    rentAmount?: number;
    /**
     * Phí dịch vụ
     */
    serviceAmount?: number;
    /**
     * Phí vệ sinh
     */
    sanitationAmount?: number;
    /**
     * Phí gửi xe
     */
    parkingAmount?: number;
    /**
     * Phí điện
     */
    electricityAmount?: number;
    /**
     * Phí nước
     */
    waterAmount?: number;
    /**
     * Phí nhà ở
     */
    housingAmount?: number;
};

