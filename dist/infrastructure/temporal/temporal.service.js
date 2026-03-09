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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@temporalio/client");
let TemporalService = class TemporalService {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.client = null;
    }
    async onModuleInit() {
        const address = this.config.get('TEMPORAL_ADDRESS', 'temporal:7233');
        const namespace = this.config.get('TEMPORAL_NAMESPACE', 'default');
        this.connection = await client_1.Connection.connect({
            address,
        });
        this.client = new client_1.Client({
            connection: this.connection,
            namespace,
        });
    }
    async onModuleDestroy() {
        if (this.connection) {
            await this.connection.close();
            this.connection = null;
            this.client = null;
        }
    }
    async startWorkflow(workflowType, options) {
        if (!this.client)
            throw new Error('Temporal client not connected');
        const { args = [], ...workflowOptions } = options;
        return this.client.workflow.start(workflowType, {
            ...workflowOptions,
            args,
        });
    }
    getClient() {
        if (!this.client)
            throw new Error('Temporal client not connected');
        return this.client;
    }
};
exports.TemporalService = TemporalService;
exports.TemporalService = TemporalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TemporalService);
//# sourceMappingURL=temporal.service.js.map