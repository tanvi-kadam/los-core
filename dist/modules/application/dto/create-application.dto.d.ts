import { ConsentDto } from './consent.dto';
export declare class CreateApplicationDto {
    entityType: string;
    entityIdentifier: string;
    pan: string;
    productCode: string;
    loanAmount: number;
    loanTenureMonths: number;
    purpose?: string | null;
    consents?: ConsentDto[];
}
