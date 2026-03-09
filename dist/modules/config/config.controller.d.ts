import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    create(dto: CreateConfigDto): Promise<{
        id: string;
        configType: string;
        configKey: string;
        version: number;
    }>;
    getByType(type: string): Promise<Record<string, unknown>[]>;
}
