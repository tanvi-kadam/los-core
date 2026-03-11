import { WorkflowRepository } from "./repositories/workflow.repository";
import { ApplicationRepository } from "../application/repositories/application.repository";
import { AuditService } from "../audit/audit.service";
import { KafkaProducerService } from "../../infrastructure/kafka";
import { TransitionDto } from "./dto/transition.dto";
import { ApplicationStateTransitionDto } from "./dto/application-transitions.dto";
export declare class WorkflowService {
    private readonly workflowRepository;
    private readonly applicationRepository;
    private readonly auditService;
    private readonly kafkaProducer;
    constructor(workflowRepository: WorkflowRepository, applicationRepository: ApplicationRepository, auditService: AuditService, kafkaProducer: KafkaProducerService);
    transition(applicationId: string, dto: TransitionDto, userId: string, triggeredRole: string, authoritySnapshot: Record<string, unknown> | null, correlationId?: string): Promise<{
        application_id: string;
        from_state: string;
        to_state: string;
    }>;
    getTransitionsForApplication(applicationId: string): Promise<ApplicationStateTransitionDto[]>;
}
