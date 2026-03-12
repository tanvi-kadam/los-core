import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IdempotencyService } from '../idempotency.service';
export declare class IdempotencyStoreInterceptor implements NestInterceptor {
    private readonly idempotencyService;
    private readonly logger;
    constructor(idempotencyService: IdempotencyService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
