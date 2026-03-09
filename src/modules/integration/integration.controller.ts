import { Controller, Post, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { IntegrationService } from './integration.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('integration')
@Controller('integration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('mca-pull/:application_id')
  @ApiOperation({ summary: 'Pull MCA entity snapshot for application' })
  @ApiResponse({ status: 200, description: 'Snapshot created' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async mcaPull(
    @Param('application_id', ParseUUIDPipe) applicationId: string,
    @Req() req: Request,
  ) {
    return this.integrationService.mcaPull(applicationId, req.correlationId);
  }
}
