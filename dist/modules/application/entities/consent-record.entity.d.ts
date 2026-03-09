import { Application } from './application.entity';
import { ConsentType } from './consent-type.entity';
export declare class ConsentRecord {
    id: string;
    applicationId: string;
    consentTypeId: string;
    consentedAt: Date;
    createdAt: Date;
    application: Application;
    consentType: ConsentType;
}
