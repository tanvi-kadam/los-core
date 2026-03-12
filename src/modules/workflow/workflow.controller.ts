import { Controller, Post, Body, Param, UseGuards, ParseUUIDPipe, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { WorkflowService } from './workflow.service';
import { TransitionDto } from './dto/transition.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('workflow')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post(':id/transition')
  @ApiOperation({ summary: 'Transition application state' })
  @ApiHeader({
    name: 'X-Idempotency-Key',
    required: true,
    description: 'Unique key for this request; retries with same key return the stored response.',
  })
  @ApiResponse({ status: 200, description: 'State transition recorded' })
  @ApiResponse({ status: 400, description: 'Invalid transition' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async transition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionDto,
    @Req() req: Request & { user: { user_id: string; role_id?: string }; authoritySnapshot?: Record<string, unknown> },
  ) {
    const userId = req.user?.user_id ?? '';
    const triggeredRole = (req as Request & { user?: { role_name?: string } }).user?.role_name ?? req.user?.role_id ?? '';
    const authoritySnapshot = (req as Request & { authoritySnapshot?: Record<string, unknown> }).authoritySnapshot;
    return this.workflowService.transition(
      id,
      dto,
      userId,
      triggeredRole,
      authoritySnapshot ?? null,
      req.correlationId,
    );
  }

  @Get(':id/transitions')
  @ApiOperation({ summary: 'List state transitions for an application' })
  @ApiResponse({
    status: 200,
    description: 'Transition history for the application',
    schema: {
      example: {
        status: 'SUCCESS',
        data: [
          {
            id: 'uuid',
            application_id: 'uuid',
            from_state: 'DRAFT',
            to_state: 'SUBMITTED',
            triggered_by: 'user-uuid',
            triggered_role: 'ROLE_RM',
            authority_snapshot: { max_loan_amount: '10000000' },
            correlation_id: 'uuid',
            occurred_at: '2026-03-10T12:00:00Z',
          },
        ],
        correlation_id: 'uuid',
      },
    },
  })
  async listTransitions(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workflowService.getTransitionsForApplication(id);
  }
}
