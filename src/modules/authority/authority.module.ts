import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityMatrix } from './entities/authority-matrix.entity';
import { AuthorityRepository } from './repositories/authority.repository';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorityMatrix]),
    AuthModule,
  ],
  controllers: [AuthorityController],
  providers: [AuthorityService, AuthorityRepository],
  exports: [AuthorityService],
})
export class AuthorityModule {}
