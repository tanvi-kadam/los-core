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
exports.AuthorityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authority_service_1 = require("./authority.service");
const create_authority_dto_1 = require("./dto/create-authority.dto");
const update_authority_dto_1 = require("./dto/update-authority.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let AuthorityController = class AuthorityController {
    constructor(authorityService) {
        this.authorityService = authorityService;
    }
    async createMatrix(dto) {
        return this.authorityService.createAuthorityRule(dto);
    }
    async updateMatrix(id, dto) {
        return this.authorityService.updateAuthorityRule(id, dto);
    }
    async getByRole(roleId) {
        return this.authorityService.getAuthorityForRole(roleId);
    }
};
exports.AuthorityController = AuthorityController;
__decorate([
    (0, common_1.Post)('matrix'),
    (0, swagger_1.ApiOperation)({ summary: 'Create authority matrix rule' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Authority rule created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_authority_dto_1.CreateAuthorityDto]),
    __metadata("design:returntype", Promise)
], AuthorityController.prototype, "createMatrix", null);
__decorate([
    (0, common_1.Put)('matrix/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update authority matrix rule' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Authority rule updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Authority matrix not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_authority_dto_1.UpdateAuthorityDto]),
    __metadata("design:returntype", Promise)
], AuthorityController.prototype, "updateMatrix", null);
__decorate([
    (0, common_1.Get)('role/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authority rules for role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of authority rules' }),
    __param(0, (0, common_1.Param)('roleId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthorityController.prototype, "getByRole", null);
exports.AuthorityController = AuthorityController = __decorate([
    (0, swagger_1.ApiTags)('authority'),
    (0, common_1.Controller)('authority'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    __metadata("design:paramtypes", [authority_service_1.AuthorityService])
], AuthorityController);
//# sourceMappingURL=authority.controller.js.map