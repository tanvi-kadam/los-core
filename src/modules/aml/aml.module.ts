import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmlRiskProfile } from './entities/aml-risk-profile.entity';
import { AmlRiskProfileRepository } from './repositories/aml-risk-profile.repository';
import { AmlService } from './aml.service';
import { AmlController } from './aml.controller';
import { ApplicationModule } from '../application/application.module';
import { KafkaModule } from '../../infrastructure/kafka';

@Module({
  imports: [
    TypeOrmModule.forFeature([AmlRiskProfile]),
    ApplicationModule,
    KafkaModule,
  ],
  controllers: [AmlController],
  providers: [AmlRiskProfileRepository, AmlService],
  exports: [AmlService],
})
export class AmlModule {}
