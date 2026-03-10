import { Application } from './application.entity';
import { ConsentType } from './consent-type.entity';
export declare class ConsentRecord {
    id: string;
    applicationId: string;
    consentTypeId: string;
    consentTextVersion: number | null;
    ipAddress: string | null;
    userAgent: string | null;
    correlationId: string | null;
    createdAt: Date;
    application: Application;
    consentType: ConsentType;
}
