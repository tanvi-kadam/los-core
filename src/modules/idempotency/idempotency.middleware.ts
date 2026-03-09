import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { IdempotencyService } from './idempotency.service';

const IDEMPOTENCY_HEADER = 'x-idempotency-key';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const key = (req.headers[IDEMPOTENCY_HEADER] as string)?.trim();
    if (!key) return next();

    const endpoint = req.method + ' ' + (req.baseUrl || req.path);
    const userId = (req as Request & { user?: { user_id?: string } }).user?.user_id ?? null;
    const body = req.body ?? {};
    const requestHash = createHash('sha256').update(JSON.stringify(body)).digest('hex');

    try {
      const stored = await this.idempotencyService.check(key, endpoint, requestHash, userId);
      if (stored) {
        // Stored snapshot is the full wrapped response { status, data, correlation_id }
        res.status(200).json(stored);
        return;
      }
      req.idempotencyKey = key;
      req.idempotencyRequestHash = requestHash;
      req.idempotencyEndpoint = endpoint;
      req.idempotencyUserId = userId;
      next();
    } catch (err) {
      next(err);
    }
  }
}
