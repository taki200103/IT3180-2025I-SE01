import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceResponseDto } from './invoice.dtos';
export declare class InvoiceService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto>;
    findAll(): Promise<InvoiceResponseDto[]>;
    getAllByResidentId(residentId: string): Promise<InvoiceResponseDto[]>;
    getAllByServiceId(serviceId: number): Promise<InvoiceResponseDto[]>;
    findOne(id: string): Promise<InvoiceResponseDto>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    payInvoice(id: string): Promise<InvoiceResponseDto>;
    approveInvoice(id: string): Promise<InvoiceResponseDto>;
    rejectInvoice(id: string): Promise<InvoiceResponseDto>;
}
