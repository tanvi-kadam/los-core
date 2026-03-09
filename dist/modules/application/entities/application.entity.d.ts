import { ConsentRecord } from './consent-record.entity';
import { DuplicateCheck } from './duplicate-check.entity';
export declare class Application {
    id: string;
    entityType: string;
    entityIdentifier: string;
    pan: string;
    productCode: string;
    loanAmount: string;
    loanTenureMonths: number;
    purpose: string | null;
    currentState: string;
    consentStatus: string;
    duplicateFlag: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    consentRecords: ConsentRecord[];
    duplicateChecks: DuplicateCheck[];
}
