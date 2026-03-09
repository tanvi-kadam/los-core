import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyRegistry } from './entities/policy-registry.entity';
import { PolicyRepository } from './repositories/policy.repository';
import { PolicyService } from './policy.service';
import { PolicyController } from './policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyRegistry])],
  controllers: [PolicyController],
  providers: [PolicyRepository, PolicyService],
  exports: [PolicyService],
})
export class PolicyModule {}
