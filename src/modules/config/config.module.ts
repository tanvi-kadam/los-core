import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { ConfigRepository } from './repositories/config.repository';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  controllers: [ConfigController],
  providers: [ConfigRepository, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
