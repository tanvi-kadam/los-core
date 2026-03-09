import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const HEADER = 'x-correlation-id';

/**
 * Global middleware: ensure every request has X-Correlation-ID.
 * If header is missing, generate a UUID. Attach to request and set on response.
 */
export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id =
    (req.headers[HEADER] as string)?.trim() || uuidv4();
  req.headers[HEADER] = id;
  req.correlationId = id;
  res.setHeader('X-Correlation-ID', id);
  next();
}
