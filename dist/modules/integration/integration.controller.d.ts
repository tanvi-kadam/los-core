import { Request } from 'express';
import { IntegrationService } from './integration.service';
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    mcaPull(applicationId: string, req: Request): Promise<{
        application_id: string;
        mca_reference_id: string | null;
        legal_name: string | null;
        snapshot_version: number;
        pulled_at: string;
    }>;
}
