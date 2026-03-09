import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotencyKey } from './entities/idempotency-key.entity';
import { IdempotencyRepository } from './repositories/idempotency.repository';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyMiddleware } from './idempotency.middleware';
import { IdempotencyStoreInterceptor } from './interceptors/idempotency-store.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([IdempotencyKey])],
  providers: [
    IdempotencyRepository,
    IdempotencyService,
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyStoreInterceptor,
    },
  ],
  exports: [IdempotencyService],
})
export class IdempotencyModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(IdempotencyMiddleware)
      .forRoutes(
        'applications',
        'applications/*/transition',
        'approvals',
        'approvals/*/decision',
      );
  }
}
