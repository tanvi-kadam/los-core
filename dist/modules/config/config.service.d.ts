import { ConfigRepository } from './repositories/config.repository';
import { CreateConfigDto } from './dto/create-config.dto';
export declare class ConfigService {
    private readonly repository;
    constructor(repository: ConfigRepository);
    create(dto: CreateConfigDto): Promise<{
        id: string;
        configType: string;
        configKey: string;
        version: number;
    }>;
    getByType(configType: string): Promise<Record<string, unknown>[]>;
}
