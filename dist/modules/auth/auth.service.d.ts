import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { UserRepository } from "./repositories/user.repository";
import { UserRoleRepository } from "./repositories/user-role.repository";
import { RedisService } from "../../infrastructure/redis";
import { LoginDto } from "./dto/login.dto";
export interface JwtPayload {
    sub: string;
    email: string;
    role_id: string;
    type: "access" | "refresh";
}
export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}
export interface CurrentUserDto {
    user_id: string;
    email: string;
    role_id: string;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly userRoleRepository;
    private readonly jwtService;
    private readonly config;
    private readonly redis;
    private readonly logger;
    constructor(userRepository: UserRepository, userRoleRepository: UserRoleRepository, jwtService: JwtService, config: ConfigService, redis: RedisService, logger: PinoLogger);
    login(dto: LoginDto, correlationId?: string): Promise<AuthTokens>;
    refresh(refreshToken: string, correlationId?: string): Promise<AuthTokens>;
    getMe(userId: string): Promise<CurrentUserDto>;
    validatePayload(payload: JwtPayload): Promise<CurrentUserDto | null>;
    private getAuthCache;
    private setAuthCache;
    private parseExpiryToSeconds;
}
