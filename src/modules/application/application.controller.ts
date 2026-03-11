import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Request } from "express";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ConsentDto } from "./dto/consent.dto";
import { ListApplicationsQueryDto } from "./dto/list-applications.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";

@ApiTags("application")
@Controller("applications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("jwt")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @ApiOperation({ summary: "List applications (paginated)" })
  @ApiResponse({
    status: 200,
    description: "Paginated list of applications",
    schema: {
      example: {
        status: "SUCCESS",
        data: {
          items: [
            {
              id: "uuid",
              entity_type: "PRIVATE_LIMITED",
              entity_identifier: "U12345MH2020PTC123456",
              pan: "ABCDE1234F",
              product_code: "TERM_LOAN",
              loan_amount: "5000000.00",
              loan_tenure_months: 36,
              purpose: "Working capital",
              current_state: "DRAFT",
              consent_status: "CONSENTED",
              duplicate_flag: false,
              created_by: "user-uuid",
              created_at: "2026-03-10T12:00:00Z",
            },
          ],
          page: 1,
          limit: 20,
          total: 1,
        },
        correlation_id: "uuid",
      },
    },
  })
  async list(@Query() query: ListApplicationsQueryDto) {
    return this.applicationService.listApplications(query);
  }

  @Post()
  @ApiOperation({ summary: "Create application" })
  @ApiResponse({
    status: 201,
    description: "Application created",
    schema: {
      example: {
        status: "SUCCESS",
        data: { application_id: "uuid", current_state: "DRAFT" },
        correlation_id: "",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Validation error" })
  async create(
    @Body() dto: CreateApplicationDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.create(
      dto,
      req.user.user_id,
      req.correlationId,
      {
        ip: req.ip,
        userAgent: (req.headers["user-agent"] as string) || undefined,
      },
    );
  }

  @Put(":id")
  @ApiOperation({ summary: "Update application (DRAFT only)" })
  @ApiResponse({ status: 200, description: "Application updated" })
  @ApiResponse({ status: 404, description: "Application not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.update(
      id,
      dto,
      req.user.user_id,
      req.correlationId,
    );
  }

  @Post(":id/consent")
  @ApiOperation({ summary: "Record consent for application" })
  @ApiResponse({ status: 201, description: "Consent recorded" })
  @ApiResponse({
    status: 404,
    description: "Application or consent type not found",
  })
  async consent(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ConsentDto,
    @Req() req: Request & { user: { user_id: string } },
  ) {
    return this.applicationService.addConsent(
      id,
      dto,
      req.user.user_id,
      req.correlationId,
    );
  }

  @Post(":id/submit")
  @ApiOperation({ summary: "Submit application" })
  @ApiResponse({ status: 200, description: "Application submitted" })
  @ApiResponse({ status: 400, description: "Not DRAFT or consent missing" })
  @ApiResponse({ status: 404, description: "Application not found" })
  async submit(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: Request & { user: { user_id: string; role_id?: string } },
  ) {
    return this.applicationService.submit(
      id,
      req.user.user_id,
      req.user.role_id,
      req.correlationId,
    );
  }

  @Get("consent-types")
  @ApiOperation({ summary: "List available consent types" })
  @ApiResponse({
    status: 200,
    description: "List of active consent types",
    schema: {
      example: {
        status: "SUCCESS",
        data: [
          {
            id: "uuid",
            consent_code: "BUREAU_PULL",
            description:
              "Consent for credit bureau pull (CRIF, Experian, CIBIL)",
          },
          {
            id: "uuid",
            consent_code: "ACCOUNT_AGGREGATOR",
            description:
              "Consent for fetching banking data via Account Aggregator ecosystem",
          },
        ],
        correlation_id: "uuid",
      },
    },
  })
  async getConsentTypes() {
    return this.applicationService.getConsentTypes();
  }

  @Get(":id/duplicates")
  @ApiOperation({ summary: "Run duplicate detection for application" })
  @ApiResponse({
    status: 200,
    description: "Duplicate detection executed",
    schema: {
      example: {
        status: "SUCCESS",
        data: {
          duplicate_flag: true,
          matched_application_ids: ["uuid-1", "uuid-2"],
        },
        correlation_id: "",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Application not found" })
  async duplicates(@Param("id", ParseUUIDPipe) id: string) {
    return this.applicationService.findDuplicates(id);
  }
}
