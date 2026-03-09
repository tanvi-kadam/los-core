import { Repository } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';
export declare class ConfigRepository {
    private readonly repo;
    constructor(repo: Repository<Configuration>);
    findByType(configType: string, asOf?: Date): Promise<Configuration[]>;
    save(entity: Partial<Configuration>): Promise<Configuration>;
}
