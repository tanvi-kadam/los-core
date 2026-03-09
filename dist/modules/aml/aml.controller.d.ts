import { Request } from 'express';
import { AmlService } from './aml.service';
export declare class AmlController {
    private readonly amlService;
    constructor(amlService: AmlService);
    compute(applicationId: string, req: Request): Promise<{
        risk_band: string;
        composite_score: number;
    }>;
}
