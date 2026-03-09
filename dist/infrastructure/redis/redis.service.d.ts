import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    constructor(client: Redis);
    onModuleDestroy(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    setWithTTL(key: string, value: string, ttlSeconds: number): Promise<void>;
    delete(key: string): Promise<void>;
    acquireLock(key: string, ttlMs: number): Promise<string | null>;
    releaseLock(key: string, token: string): Promise<boolean>;
}
