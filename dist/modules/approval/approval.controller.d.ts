import { Request } from 'express';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';
export declare class ApprovalController {
    private readonly approvalService;
    constructor(approvalService: ApprovalService);
    create(dto: CreateApprovalDto, req: Request & {
        user: {
            user_id: string;
        };
        correlationId?: string;
    }): Promise<{
        id: string;
        object_type: string;
        object_id: string;
        action_type: string;
        status: string;
    }>;
    decision(id: string, dto: ApprovalDecisionDto, req: Request & {
        user: {
            user_id: string;
        };
        correlationId?: string;
    }): Promise<{
        approval_request_id: string;
        decision: string;
    }>;
}
