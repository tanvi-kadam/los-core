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
exports.ApprovalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const approval_service_1 = require("./approval.service");
const create_approval_dto_1 = require("./dto/create-approval.dto");
const approval_decision_dto_1 = require("./dto/approval-decision.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let ApprovalController = class ApprovalController {
    constructor(approvalService) {
        this.approvalService = approvalService;
    }
    async create(dto, req) {
        return this.approvalService.createRequest(dto, req.user.user_id, req.correlationId);
    }
    async decision(id, dto, req) {
        return this.approvalService.recordDecision(id, dto, req.user.user_id, req.correlationId);
    }
};
exports.ApprovalController = ApprovalController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create approval request (maker)' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Idempotency-Key',
        required: true,
        description: 'Unique key for this request; retries with same key return the stored response.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Approval request created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_approval_dto_1.CreateApprovalDto, Object]),
    __metadata("design:returntype", Promise)
], ApprovalController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/decision'),
    (0, swagger_1.ApiOperation)({ summary: 'Record approval decision (checker)' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Idempotency-Key',
        required: true,
        description: 'Unique key for this request; retries with same key return the stored response.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Decision recorded' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Maker-checker violation or not PENDING' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Approval request not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approval_decision_dto_1.ApprovalDecisionDto, Object]),
    __metadata("design:returntype", Promise)
], ApprovalController.prototype, "decision", null);
exports.ApprovalController = ApprovalController = __decorate([
    (0, swagger_1.ApiTags)('approval'),
    (0, common_1.Controller)('approvals'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    __metadata("design:paramtypes", [approval_service_1.ApprovalService])
], ApprovalController);
//# sourceMappingURL=approval.controller.js.map