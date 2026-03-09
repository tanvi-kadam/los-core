import {
  ExceptionFilter,
  Catch,
  HttpException,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId =
      request.correlationId ?? (request.headers['x-correlation-id'] as string) ?? 'unknown';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const errorResponse =
      typeof message === 'object' && message !== null && 'message' in message
        ? (message as { message: string | string[] })
        : { message: String(message) };

    const body = {
      status: 'ERROR',
      message:
        Array.isArray(errorResponse.message)
          ? errorResponse.message.join(', ')
          : errorResponse.message,
      correlation_id: correlationId,
    };

    this.logger.error(
      {
        correlation_id: correlationId,
        status,
        message: body.message,
        path: request.url,
        stack: exception instanceof Error ? exception.stack : undefined,
      },
      exception instanceof Error ? exception.message : 'Internal server error',
    );

    response.status(status).json(body);
  }
}
