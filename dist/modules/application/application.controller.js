"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const application_service_1 = require("./application.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const consent_dto_1 = require("./dto/consent.dto");
const list_applications_dto_1 = require("./dto/list-applications.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let ApplicationController = class ApplicationController {
    constructor(applicationService) {
        this.applicationService = applicationService;
    }
    async list(query) {
        return this.applicationService.listApplications(query);
    }
    async create(dto, req) {
        return this.applicationService.create(dto, req.user.user_id, req.correlationId, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || undefined,
        });
    }
    async update(id, dto, req) {
        return this.applicationService.update(id, dto, req.user.user_id, req.correlationId);
    }
    async consent(id, dto, req) {
        return this.applicationService.addConsent(id, dto, req.user.user_id, req.correlationId);
    }
    async submit(id, req) {
        return this.applicationService.submit(id, req.user.user_id, req.user.role_id, req.correlationId);
    }
    async getConsentTypes() {
        return this.applicationService.getConsentTypes();
    }
    async duplicates(id) {
        return this.applicationService.findDuplicates(id);
    }
};
exports.ApplicationController = ApplicationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List applications (paginated)" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_applications_dto_1.ListApplicationsQueryDto]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create application" }),
    (0, swagger_1.ApiHeader)({
        name: "X-Idempotency-Key",
        required: true,
        description: "Unique key for this request; retries with same key return the stored response.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Application created",
        schema: {
            example: {
                status: "SUCCESS",
                data: { application_id: "uuid", current_state: "DRAFT" },
                correlation_id: "",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update application (DRAFT only)" }),
    (0, swagger_1.ApiHeader)({
        name: "X-Idempotency-Key",
        required: true,
        description: "Unique key for this request; retries with same key return the stored response.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Application updated" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Application not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/consent"),
    (0, swagger_1.ApiOperation)({ summary: "Record consent for application" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Consent recorded" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Application or consent type not found",
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, consent_dto_1.ConsentDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "consent", null);
__decorate([
    (0, common_1.Post)(":id/submit"),
    (0, swagger_1.ApiOperation)({ summary: "Submit application" }),
    (0, swagger_1.ApiHeader)({
        name: "X-Idempotency-Key",
        required: true,
        description: "Unique key for this request; retries with same key return the stored response.",
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Application submitted" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Not DRAFT or consent missing" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Application not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)("consent-types"),
    (0, swagger_1.ApiOperation)({ summary: "List available consent types" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of active consent types",
        schema: {
            example: {
                status: "SUCCESS",
                data: [
                    {
                        id: "uuid",
                        consent_code: "BUREAU_PULL",
                        description: "Consent for credit bureau pull (CRIF, Experian, CIBIL)",
                    },
                    {
                        id: "uuid",
                        consent_code: "ACCOUNT_AGGREGATOR",
                        description: "Consent for fetching banking data via Account Aggregator ecosystem",
                    },
                ],
                correlation_id: "uuid",
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "getConsentTypes", null);
__decorate([
    (0, common_1.Get)(":id/duplicates"),
    (0, swagger_1.ApiOperation)({ summary: "Run duplicate detection for application" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Application not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationController.prototype, "duplicates", null);
exports.ApplicationController = ApplicationController = __decorate([
    (0, swagger_1.ApiTags)("application"),
    (0, common_1.Controller)("applications"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("jwt"),
    __metadata("design:paramtypes", [application_service_1.ApplicationService])
], ApplicationController);
//# sourceMappingURL=application.controller.js.map