import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { IdempotencyService } from './idempotency.service';

const IDEMPOTENCY_HEADER = 'x-idempotency-key';

function requiresIdempotency(method: string, path: string): boolean {
  const p = path.replace(/\/$/, '') || '/';
  if (method === 'POST' && (p === '/applications' || p === '/applications/'))
    return true;
  if (method === 'PUT' && /^\/applications\/[^/]+$/.test(p)) return true;
  if (method === 'POST' && /^\/applications\/[^/]+\/submit$/.test(p))
    return true;
  if (method === 'POST' && /^\/applications\/[^/]+\/transition$/.test(p))
    return true;
  if (method === 'POST' && (p === '/approvals' || p === '/approvals/'))
    return true;
  if (method === 'POST' && /^\/approvals\/[^/]+\/decision$/.test(p))
    return true;
  return false;
}

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const path = (req.baseUrl || req.path || '').replace(/\/$/, '') || '/';
    const key = (req.headers[IDEMPOTENCY_HEADER] as string)?.trim();

    if (!key) {
      if (requiresIdempotency(req.method, path)) {
        res.status(400).json({
          status: 'ERROR',
          message: 'X-Idempotency-Key is required for this request',
          correlation_id: (req as Request & { correlationId?: string }).correlationId ?? '',
        });
        return;
      }
      return next();
    }

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
