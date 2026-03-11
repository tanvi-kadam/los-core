import { PinoLogger } from "nestjs-pino";
import { RedisService } from "../../infrastructure/redis";
import { AuthorityRepository } from "./repositories/authority.repository";
import { CreateAuthorityDto } from "./dto/create-authority.dto";
import { UpdateAuthorityDto } from "./dto/update-authority.dto";
export interface AuthorityRuleDto {
    id: string;
    role_id: string;
    max_loan_amount: string;
    max_deviation_percent: string | null;
    allowed_products: string[] | null;
    allowed_geographies: string[] | null;
    effective_from: string;
    effective_to: string | null;
}
export declare class AuthorityService {
    private readonly authorityRepository;
    private readonly redis;
    private readonly logger;
    constructor(authorityRepository: AuthorityRepository, redis: RedisService, logger: PinoLogger);
    createAuthorityRule(dto: CreateAuthorityDto): Promise<AuthorityRuleDto>;
    updateAuthorityRule(id: string, dto: UpdateAuthorityDto): Promise<AuthorityRuleDto>;
    getAuthorityForRole(roleId: string): Promise<AuthorityRuleDto[]>;
    checkAuthorityLimit(roleId: string, loanAmount: number, makerId?: string, checkerId?: string): Promise<void>;
    private getAuthorityCache;
    private setAuthorityCache;
    private invalidateAuthorityCache;
    private toDto;
}
