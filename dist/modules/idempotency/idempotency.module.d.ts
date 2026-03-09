import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class IdempotencyModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
