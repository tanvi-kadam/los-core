import { Request } from 'express';
import { AuthService, CurrentUserDto } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request): Promise<import("./auth.service").AuthTokens>;
    refresh(dto: RefreshDto, req: Request): Promise<import("./auth.service").AuthTokens>;
    me(req: Request & {
        user: CurrentUserDto;
    }): Promise<CurrentUserDto>;
}
