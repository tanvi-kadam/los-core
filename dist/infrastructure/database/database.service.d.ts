import { OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    onModuleDestroy(): Promise<void>;
    getDataSource(): DataSource;
    isHealthy(): Promise<boolean>;
}
