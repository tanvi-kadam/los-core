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
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_service_1 = require("./config.service");
const create_config_dto_1 = require("./dto/create-config.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let ConfigController = class ConfigController {
    constructor(configService) {
        this.configService = configService;
    }
    async create(dto) {
        return this.configService.create(dto);
    }
    async getByType(type) {
        return this.configService.getByType(type);
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Configuration created', schema: { example: { status: 'SUCCESS', data: { id: 'uuid', configType: 'RATE', configKey: 'base_rate', version: 1 }, correlation_id: '' } } }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_config_dto_1.CreateConfigDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get configurations by type' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of configurations' }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getByType", null);
exports.ConfigController = ConfigController = __decorate([
    (0, swagger_1.ApiTags)('config'),
    (0, common_1.Controller)('config'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], ConfigController);
//# sourceMappingURL=config.controller.js.map