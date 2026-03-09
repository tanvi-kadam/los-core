import { Request } from 'express';
import { WorkflowService } from './workflow.service';
import { TransitionDto } from './dto/transition.dto';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    transition(id: string, dto: TransitionDto, req: Request & {
        user: {
            user_id: string;
            role_id?: string;
        };
        authoritySnapshot?: Record<string, unknown>;
    }): Promise<{
        application_id: string;
        from_state: string;
        to_state: string;
    }>;
}
