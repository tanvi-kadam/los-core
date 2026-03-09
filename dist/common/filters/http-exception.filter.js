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
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const correlationId = request.correlationId ?? request.headers['x-correlation-id'] ?? 'unknown';
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : exception instanceof Error
                ? exception.message
                : 'Internal server error';
        const errorResponse = typeof message === 'object' && message !== null && 'message' in message
            ? message
            : { message: String(message) };
        const body = {
            status: 'ERROR',
            message: Array.isArray(errorResponse.message)
                ? errorResponse.message.join(', ')
                : errorResponse.message,
            correlation_id: correlationId,
        };
        this.logger.error({
            correlation_id: correlationId,
            status,
            message: body.message,
            path: request.url,
            stack: exception instanceof Error ? exception.stack : undefined,
        }, exception instanceof Error ? exception.message : 'Internal server error');
        response.status(status).json(body);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger])
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map