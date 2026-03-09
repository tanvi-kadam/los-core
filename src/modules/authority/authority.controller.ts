import { Controller, Post, Put, Get, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthorityService, AuthorityRuleDto } from './authority.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('authority')
@Controller('authority')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class AuthorityController {
  constructor(private readonly authorityService: AuthorityService) {}

  @Post('matrix')
  @ApiOperation({ summary: 'Create authority matrix rule' })
  @ApiResponse({ status: 201, description: 'Authority rule created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createMatrix(@Body() dto: CreateAuthorityDto): Promise<AuthorityRuleDto> {
    return this.authorityService.createAuthorityRule(dto);
  }

  @Put('matrix/:id')
  @ApiOperation({ summary: 'Update authority matrix rule' })
  @ApiResponse({ status: 200, description: 'Authority rule updated' })
  @ApiResponse({ status: 404, description: 'Authority matrix not found' })
  async updateMatrix(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAuthorityDto,
  ): Promise<AuthorityRuleDto> {
    return this.authorityService.updateAuthorityRule(id, dto);
  }

  @Get('role/:roleId')
  @ApiOperation({ summary: 'Get authority rules for role' })
  @ApiResponse({ status: 200, description: 'List of authority rules' })
  async getByRole(
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ): Promise<AuthorityRuleDto[]> {
    return this.authorityService.getAuthorityForRole(roleId);
  }
}
