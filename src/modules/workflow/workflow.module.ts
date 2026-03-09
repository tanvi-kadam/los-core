import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationStateTransition } from './entities/application-state-transition.entity';
import { WorkflowRepository } from './repositories/workflow.repository';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { ApplicationModule } from '../application/application.module';
import { AuditModule } from '../audit/audit.module';
import { KafkaModule } from '../../infrastructure/kafka';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationStateTransition]),
    ApplicationModule,
    AuditModule,
    KafkaModule,
  ],
  controllers: [WorkflowController],
  providers: [WorkflowRepository, WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
