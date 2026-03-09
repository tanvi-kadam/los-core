import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService, CurrentUserDto } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { status: 'SUCCESS', data: { access_token: 'eyJ...', refresh_token: 'eyJ...', expires_in: 900 }, correlation_id: '' } } })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
  ) {
    return this.authService.login(dto, req.correlationId);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
  ) {
    return this.authService.refresh(dto.refresh_token, req.correlationId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user', schema: { example: { status: 'SUCCESS', data: { user_id: '', email: '', role_id: '' }, correlation_id: '' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req: Request & { user: CurrentUserDto }): Promise<CurrentUserDto> {
    return this.authService.getMe(req.user.user_id);
  }
}
