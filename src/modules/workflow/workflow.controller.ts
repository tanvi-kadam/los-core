import { Controller, Post, Body, Param, UseGuards, ParseUUIDPipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
}
