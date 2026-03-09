import type { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      /** Set by IdempotencyMiddleware when X-Idempotency-Key is present and no stored response was found */
      idempotencyKey?: string;
      idempotencyRequestHash?: string;
      idempotencyEndpoint?: string;
      idempotencyUserId?: string | null;
    }
  }
}

export {};
