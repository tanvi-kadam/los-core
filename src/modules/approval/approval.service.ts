import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApprovalRequestRepository } from './repositories/approval-request.repository';
import { ApprovalDecisionRepository } from './repositories/approval-decision.repository';
import { AuditService } from '../audit/audit.service';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { KAFKA_TOPICS } from '../../common/constants/kafka-topics';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';

@Injectable()
export class ApprovalService {
  constructor(
    private readonly approvalRequestRepository: ApprovalRequestRepository,
    private readonly approvalDecisionRepository: ApprovalDecisionRepository,
    private readonly auditService: AuditService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async createRequest(
    dto: CreateApprovalDto,
    makerId: string,
    correlationId?: string,
  ): Promise<{ id: string; object_type: string; object_id: string; action_type: string; status: string }> {
    const request = await this.approvalRequestRepository.save({
      objectType: dto.objectType,
      objectId: dto.objectId,
      actionType: dto.actionType,
      makerId,
      status: 'PENDING',
    });

    await this.auditService.record({
      actorId: makerId,
      actorRole: '',
      actionType: 'APPROVAL_REQUEST',
      objectType: 'APPROVAL_REQUEST',
      objectId: request.id,
      correlationId: correlationId ?? null,
    });

    await this.kafkaProducer.send(KAFKA_TOPICS.APPROVAL_EVENTS, {
      event_type: 'ApprovalRequested',
      correlation_id: correlationId ?? '',
      payload: {
        approval_request_id: request.id,
        object_type: request.objectType,
        object_id: request.objectId,
        action_type: request.actionType,
        maker_id: makerId,
        status: request.status,
      },
    });

    return {
      id: request.id,
      object_type: request.objectType,
      object_id: request.objectId,
      action_type: request.actionType,
      status: request.status,
    };
  }

  async recordDecision(
    approvalRequestId: string,
    dto: ApprovalDecisionDto,
    checkerId: string,
    correlationId?: string,
  ): Promise<{ approval_request_id: string; decision: string }> {
    const request = await this.approvalRequestRepository.findById(approvalRequestId);
    if (!request) throw new NotFoundException('Approval request not found');
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Approval request is not PENDING');
    }
    if (request.makerId === checkerId) {
      throw new BadRequestException('Checker cannot be the same as maker (maker-checker rule)');
    }

    await this.approvalDecisionRepository.save({
      approvalRequestId,
      checkerId,
      decision: dto.decision,
      authoritySnapshot: dto.authoritySnapshot ?? null,
      decidedAt: new Date(),
    });

    await this.approvalRequestRepository.save({
      ...request,
      status: dto.decision,
    });

    await this.auditService.record({
      actorId: checkerId,
      actorRole: '',
      authoritySnapshot: dto.authoritySnapshot ?? undefined,
      actionType: 'APPROVAL_DECISION',
      objectType: 'APPROVAL_REQUEST',
      objectId: approvalRequestId,
      afterStateHash: dto.decision,
      correlationId: correlationId ?? null,
    });

    await this.kafkaProducer.send(KAFKA_TOPICS.APPROVAL_EVENTS, {
      event_type: 'ApprovalDecision',
      correlation_id: correlationId ?? '',
      payload: {
        approval_request_id: approvalRequestId,
        checker_id: checkerId,
        decision: dto.decision,
      },
    });

    return { approval_request_id: approvalRequestId, decision: dto.decision };
  }
}
