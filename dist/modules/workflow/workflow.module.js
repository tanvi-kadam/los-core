"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const application_state_transition_entity_1 = require("./entities/application-state-transition.entity");
const workflow_repository_1 = require("./repositories/workflow.repository");
const workflow_service_1 = require("./workflow.service");
const workflow_controller_1 = require("./workflow.controller");
const application_module_1 = require("../application/application.module");
const audit_module_1 = require("../audit/audit.module");
const kafka_1 = require("../../infrastructure/kafka");
let WorkflowModule = class WorkflowModule {
};
exports.WorkflowModule = WorkflowModule;
exports.WorkflowModule = WorkflowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([application_state_transition_entity_1.ApplicationStateTransition]),
            application_module_1.ApplicationModule,
            audit_module_1.AuditModule,
            kafka_1.KafkaModule,
        ],
        controllers: [workflow_controller_1.WorkflowController],
        providers: [workflow_repository_1.WorkflowRepository, workflow_service_1.WorkflowService],
        exports: [workflow_service_1.WorkflowService],
    })
], WorkflowModule);
//# sourceMappingURL=workflow.module.js.map