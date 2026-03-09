import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ConsentType } from './entities/consent-type.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { DuplicateCheck } from './entities/duplicate-check.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ConsentTypeRepository } from './repositories/consent-type.repository';
import { ConsentRecordRepository } from './repositories/consent-record.repository';
import { DuplicateCheckRepository } from './repositories/duplicate-check.repository';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AuditModule } from '../audit/audit.module';
import { KafkaModule } from '../../infrastructure/kafka';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      ConsentType,
      ConsentRecord,
      DuplicateCheck,
    ]),
    AuditModule,
    KafkaModule,
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationRepository,
    ConsentTypeRepository,
    ConsentRecordRepository,
    DuplicateCheckRepository,
    ApplicationService,
  ],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
