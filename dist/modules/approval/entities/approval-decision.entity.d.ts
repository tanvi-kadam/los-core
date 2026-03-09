import { ApprovalRequest } from './approval-request.entity';
export declare class ApprovalDecision {
    id: string;
    approvalRequestId: string;
    checkerId: string;
    decision: string;
    authoritySnapshot: Record<string, unknown> | null;
    decidedAt: Date;
    approvalRequest: ApprovalRequest;
}
