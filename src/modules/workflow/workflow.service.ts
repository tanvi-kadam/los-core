import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { WorkflowRepository } from './repositories/workflow.repository';
import { ApplicationRepository } from '../application/repositories/application.repository';
import { AuditService } from '../audit/audit.service';
import { KafkaProducerService } from '../../infrastructure/kafka';
import { KAFKA_TOPICS } from '../../common/constants/kafka-topics';
import { TransitionDto } from './dto/transition.dto';

@Injectable()
export class WorkflowService {
  constructor(
    private readonly workflowRepository: WorkflowRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly auditService: AuditService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async transition(
    applicationId: string,
    dto: TransitionDto,
    userId: string,
    triggeredRole: string,
    authoritySnapshot: Record<string, unknown> | null,
    correlationId?: string,
  ): Promise<{ application_id: string; from_state: string; to_state: string }> {
    const app = await this.applicationRepository.findById(applicationId);
    if (!app) throw new NotFoundException('Application not found');

    const fromState = app.currentState;
    const toState = dto.target_state;
    if (fromState === toState) {
      throw new BadRequestException('Target state is same as current state');
    }

    // Sprint-1: only allow DRAFT -> SUBMITTED
    if (!(fromState === 'DRAFT' && toState === 'SUBMITTED')) {
      throw new ConflictException('Invalid state transition for application');
    }

    await this.applicationRepository.save({
      ...app,
      currentState: toState,
    });

    await this.workflowRepository.save({
      applicationId,
      fromState,
      toState,
      triggeredBy: userId,
      triggeredRole,
      authoritySnapshot,
      occurredAt: new Date(),
      correlationId: correlationId ?? null,
    });

    await this.auditService.record({
      actorId: userId,
      actorRole: triggeredRole,
      authoritySnapshot: authoritySnapshot ?? undefined,
      actionType: 'STATE_CHANGE',
      objectType: 'APPLICATION',
      objectId: applicationId,
      beforeStateHash: fromState,
      afterStateHash: toState,
      correlationId: correlationId ?? null,
    });

    await this.kafkaProducer.send(KAFKA_TOPICS.WORKFLOW_EVENTS, {
      event_type: 'ApplicationStateChanged',
      correlation_id: correlationId ?? '',
      payload: {
        application_id: applicationId,
        from_state: fromState,
        to_state: toState,
        triggered_by: userId,
        triggered_role: triggeredRole,
      },
    });

    return { application_id: applicationId, from_state: fromState, to_state: toState };
  }
}
