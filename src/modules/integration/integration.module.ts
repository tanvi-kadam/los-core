import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySnapshot } from './entities/entity-snapshot.entity';
import { EntitySnapshotRepository } from './repositories/entity-snapshot.repository';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntitySnapshot]),
    ApplicationModule,
  ],
  controllers: [IntegrationController],
  providers: [EntitySnapshotRepository, IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
