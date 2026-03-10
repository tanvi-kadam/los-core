"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const application_entity_1 = require("./entities/application.entity");
const consent_type_entity_1 = require("./entities/consent-type.entity");
const consent_record_entity_1 = require("./entities/consent-record.entity");
const duplicate_check_entity_1 = require("./entities/duplicate-check.entity");
const application_repository_1 = require("./repositories/application.repository");
const consent_type_repository_1 = require("./repositories/consent-type.repository");
const consent_record_repository_1 = require("./repositories/consent-record.repository");
const duplicate_check_repository_1 = require("./repositories/duplicate-check.repository");
const application_service_1 = require("./application.service");
const application_controller_1 = require("./application.controller");
const audit_module_1 = require("../audit/audit.module");
const kafka_1 = require("../../infrastructure/kafka");
const workflow_module_1 = require("../workflow/workflow.module");
const authority_module_1 = require("../authority/authority.module");
let ApplicationModule = class ApplicationModule {
};
exports.ApplicationModule = ApplicationModule;
exports.ApplicationModule = ApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                application_entity_1.Application,
                consent_type_entity_1.ConsentType,
                consent_record_entity_1.ConsentRecord,
                duplicate_check_entity_1.DuplicateCheck,
            ]),
            audit_module_1.AuditModule,
            kafka_1.KafkaModule,
            (0, common_1.forwardRef)(() => workflow_module_1.WorkflowModule),
            authority_module_1.AuthorityModule,
        ],
        controllers: [application_controller_1.ApplicationController],
        providers: [
            application_repository_1.ApplicationRepository,
            consent_type_repository_1.ConsentTypeRepository,
            consent_record_repository_1.ConsentRecordRepository,
            duplicate_check_repository_1.DuplicateCheckRepository,
            application_service_1.ApplicationService,
        ],
        exports: [application_service_1.ApplicationService, application_repository_1.ApplicationRepository],
    })
], ApplicationModule);
//# sourceMappingURL=application.module.js.map