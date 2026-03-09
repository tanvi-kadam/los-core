import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IdempotencyService } from './idempotency.service';
export declare class IdempotencyMiddleware implements NestMiddleware {
    private readonly idempotencyService;
    constructor(idempotencyService: IdempotencyService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
