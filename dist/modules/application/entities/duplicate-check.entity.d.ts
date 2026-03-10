import { Application } from './application.entity';
export declare class DuplicateCheck {
    id: string;
    applicationId: string;
    matchedApplicationId: string | null;
    matchReason: string | null;
    createdAt: Date;
    application: Application;
}
