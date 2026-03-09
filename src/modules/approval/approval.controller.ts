import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('approval')
@Controller('approvals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post()
  @ApiOperation({ summary: 'Create approval request (maker)' })
  @ApiResponse({ status: 201, description: 'Approval request created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @Body() dto: CreateApprovalDto,
    @Req() req: Request & { user: { user_id: string }; correlationId?: string },
  ) {
    return this.approvalService.createRequest(
      dto,
      req.user.user_id,
      req.correlationId,
    );
  }

  @Post(':id/decision')
  @ApiOperation({ summary: 'Record approval decision (checker)' })
  @ApiResponse({ status: 200, description: 'Decision recorded' })
  @ApiResponse({ status: 400, description: 'Maker-checker violation or not PENDING' })
  @ApiResponse({ status: 404, description: 'Approval request not found' })
  async decision(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApprovalDecisionDto,
    @Req() req: Request & { user: { user_id: string }; correlationId?: string },
  ) {
    return this.approvalService.recordDecision(
      id,
      dto,
      req.user.user_id,
      req.correlationId,
    );
  }
}
