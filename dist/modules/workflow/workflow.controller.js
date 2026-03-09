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
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflow_service_1 = require("./workflow.service");
const transition_dto_1 = require("./dto/transition.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let WorkflowController = class WorkflowController {
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    async transition(id, dto, req) {
        const userId = req.user?.user_id ?? '';
        const triggeredRole = req.user?.role_name ?? req.user?.role_id ?? '';
        const authoritySnapshot = req.authoritySnapshot;
        return this.workflowService.transition(id, dto, userId, triggeredRole, authoritySnapshot ?? null, req.correlationId);
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)(':id/transition'),
    (0, swagger_1.ApiOperation)({ summary: 'Transition application state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'State transition recorded' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid transition' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, transition_dto_1.TransitionDto, Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "transition", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, swagger_1.ApiTags)('workflow'),
    (0, common_1.Controller)('applications'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map