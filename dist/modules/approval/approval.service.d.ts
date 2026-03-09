import { ApprovalRequestRepository } from './repositories/approval-request.repository';
import { ApprovalDecisionRepository } from './repositories/approval-decision.repository';
import { AuditService } from '../audit/audit.service';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';
export declare class ApprovalService {
    private readonly approvalRequestRepository;
    private readonly approvalDecisionRepository;
    private readonly auditService;
    private readonly kafkaProducer;
    constructor(approvalRequestRepository: ApprovalRequestRepository, approvalDecisionRepository: ApprovalDecisionRepository, auditService: AuditService, kafkaProducer: KafkaProducerService);
    createRequest(dto: CreateApprovalDto, makerId: string, correlationId?: string): Promise<{
        id: string;
        object_type: string;
        object_id: string;
        action_type: string;
        status: string;
    }>;
    recordDecision(approvalRequestId: string, dto: ApprovalDecisionDto, checkerId: string, correlationId?: string): Promise<{
        approval_request_id: string;
        decision: string;
    }>;
}
