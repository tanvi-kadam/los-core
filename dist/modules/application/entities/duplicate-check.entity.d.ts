import { Application } from './application.entity';
export declare class DuplicateCheck {
    id: string;
    applicationId: string;
    checkType: string;
    duplicateFlag: boolean;
    createdAt: Date;
    application: Application;
}
