import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { IdempotencyService } from '../idempotency.service';

/**
 * Stores the response body when request had X-Idempotency-Key and middleware attached keys.
 * Should be registered after ResponseTransformInterceptor so it receives the wrapped { status, data, correlation_id }.
 */
@Injectable()
export class IdempotencyStoreInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.idempotencyKey;
    if (!key) return next.handle();

    return next.handle().pipe(
      tap(async (responseBody) => {
        if (typeof responseBody !== 'object' || responseBody === null) return;
        try {
          await this.idempotencyService.store(
            key,
            request.idempotencyEndpoint!,
            request.idempotencyUserId ?? null,
            request.idempotencyRequestHash!,
            responseBody as Record<string, unknown>,
          );
        } catch {
          // Log but do not fail the response
        }
      }),
    );
  }
}
