import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId =
      request.correlationId ?? (request.headers['x-correlation-id'] as string) ?? '';

    return next.handle().pipe(
      map((data) => ({
        status: 'SUCCESS',
        data,
        correlation_id: correlationId,
      })),
    );
  }
}
