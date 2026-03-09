"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const aml_risk_profile_entity_1 = require("./entities/aml-risk-profile.entity");
const aml_risk_profile_repository_1 = require("./repositories/aml-risk-profile.repository");
const aml_service_1 = require("./aml.service");
const aml_controller_1 = require("./aml.controller");
const application_module_1 = require("../application/application.module");
const kafka_1 = require("../../infrastructure/kafka");
let AmlModule = class AmlModule {
};
exports.AmlModule = AmlModule;
exports.AmlModule = AmlModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([aml_risk_profile_entity_1.AmlRiskProfile]),
            application_module_1.ApplicationModule,
            kafka_1.KafkaModule,
        ],
        controllers: [aml_controller_1.AmlController],
        providers: [aml_risk_profile_repository_1.AmlRiskProfileRepository, aml_service_1.AmlService],
        exports: [aml_service_1.AmlService],
    })
], AmlModule);
//# sourceMappingURL=aml.module.js.map