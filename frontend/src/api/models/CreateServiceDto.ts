/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateServiceDto = {
    /**
     * Tên loại phí (Phí thuê, Phí điện, Phí nước, Phí gửi xe, Phí vệ sinh, Phí dịch vụ, Phí nhà ở)
     */
    name: string;
    /**
     * Tháng (YYYY-MM)
     */
    month: string;
    /**
     * Số tiền của loại phí này
     */
    totalAmount: number;
    /**
     * Trạng thái: paid hoặc unpaid
     */
    status: string;
};

