import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceResponseDto } from './invoice.dtos';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto>;
    findAll(): Promise<InvoiceResponseDto[]>;
    getAllByResidentId(residentId: string): Promise<InvoiceResponseDto[]>;
    getAllByServiceId(serviceId: string): Promise<InvoiceResponseDto[]>;
    findOne(id: string): Promise<InvoiceResponseDto>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
