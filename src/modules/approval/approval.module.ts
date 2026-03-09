import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalRequest } from './entities/approval-request.entity';
import { ApprovalDecision } from './entities/approval-decision.entity';
import { ApprovalRequestRepository } from './repositories/approval-request.repository';
import { ApprovalDecisionRepository } from './repositories/approval-decision.repository';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { AuditModule } from '../audit/audit.module';
import { KafkaModule } from '../../infrastructure/kafka';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApprovalRequest, ApprovalDecision]),
    AuditModule,
    KafkaModule,
  ],
  controllers: [ApprovalController],
  providers: [
    ApprovalRequestRepository,
    ApprovalDecisionRepository,
    ApprovalService,
  ],
  exports: [ApprovalService],
})
export class ApprovalModule {}
