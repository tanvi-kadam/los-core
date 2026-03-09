import { AuthorityService, AuthorityRuleDto } from './authority.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
export declare class AuthorityController {
    private readonly authorityService;
    constructor(authorityService: AuthorityService);
    createMatrix(dto: CreateAuthorityDto): Promise<AuthorityRuleDto>;
    updateMatrix(id: string, dto: UpdateAuthorityDto): Promise<AuthorityRuleDto>;
    getByRole(roleId: string): Promise<AuthorityRuleDto[]>;
}
