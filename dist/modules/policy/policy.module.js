"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const policy_registry_entity_1 = require("./entities/policy-registry.entity");
const policy_repository_1 = require("./repositories/policy.repository");
const policy_service_1 = require("./policy.service");
const policy_controller_1 = require("./policy.controller");
let PolicyModule = class PolicyModule {
};
exports.PolicyModule = PolicyModule;
exports.PolicyModule = PolicyModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([policy_registry_entity_1.PolicyRegistry])],
        controllers: [policy_controller_1.PolicyController],
        providers: [policy_repository_1.PolicyRepository, policy_service_1.PolicyService],
        exports: [policy_service_1.PolicyService],
    })
], PolicyModule);
//# sourceMappingURL=policy.module.js.map