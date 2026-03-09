import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('config')
@Controller('config')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Create configuration' })
  @ApiResponse({ status: 201, description: 'Configuration created', schema: { example: { status: 'SUCCESS', data: { id: 'uuid', configType: 'RATE', configKey: 'base_rate', version: 1 }, correlation_id: '' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreateConfigDto) {
    return this.configService.create(dto);
  }

  @Get(':type')
  @ApiOperation({ summary: 'Get configurations by type' })
  @ApiResponse({ status: 200, description: 'List of configurations' })
  async getByType(@Param('type') type: string) {
    return this.configService.getByType(type);
  }
}
