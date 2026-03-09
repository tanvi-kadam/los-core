import { Controller, Post, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AmlService } from './aml.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('aml')
@Controller('aml')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class AmlController {
  constructor(private readonly amlService: AmlService) {}

  @Post('compute/:application_id')
  @ApiOperation({ summary: 'Compute AML risk profile for application' })
  @ApiResponse({ status: 200, description: 'Risk profile computed', schema: { example: { status: 'SUCCESS', data: { risk_band: 'MEDIUM', composite_score: 42 }, correlation_id: '' } } })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async compute(
    @Param('application_id', ParseUUIDPipe) applicationId: string,
    @Req() req: Request,
  ) {
    return this.amlService.compute(applicationId, req.correlationId);
  }
}
