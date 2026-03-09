import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ConsentDto } from './dto/consent.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('application')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create application' })
  @ApiResponse({ status: 201, description: 'Application created', schema: { example: { status: 'SUCCESS', data: { application_id: 'uuid', current_state: 'DRAFT' }, correlation_id: '' } } })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @Body() dto: CreateApplicationDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.create(
      dto,
      req.user.user_id,
      req.correlationId,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update application (DRAFT only)' })
  @ApiResponse({ status: 200, description: 'Application updated' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.update(id, dto, req.user.user_id, req.correlationId);
  }

  @Post(':id/consent')
  @ApiOperation({ summary: 'Record consent for application' })
  @ApiResponse({ status: 201, description: 'Consent recorded' })
  @ApiResponse({ status: 404, description: 'Application or consent type not found' })
  async consent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ConsentDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.addConsent(id, dto, req.user.user_id, req.correlationId);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit application' })
  @ApiResponse({ status: 200, description: 'Application submitted' })
  @ApiResponse({ status: 400, description: 'Not DRAFT or consent missing' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async submit(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.submit(id, req.user.user_id, req.correlationId);
  }
}
