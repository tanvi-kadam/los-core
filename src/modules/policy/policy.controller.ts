import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('policy')
@Controller('policy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({ summary: 'Create policy' })
  @ApiResponse({ status: 201, description: 'Policy created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() dto: CreatePolicyDto) {
    return this.policyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  @ApiResponse({ status: 200, description: 'List of policies' })
  async getAll() {
    return this.policyService.getAll();
  }
}
