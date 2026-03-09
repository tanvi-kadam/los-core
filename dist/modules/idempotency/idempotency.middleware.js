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
exports.IdempotencyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const idempotency_service_1 = require("./idempotency.service");
const IDEMPOTENCY_HEADER = 'x-idempotency-key';
let IdempotencyMiddleware = class IdempotencyMiddleware {
    constructor(idempotencyService) {
        this.idempotencyService = idempotencyService;
    }
    async use(req, res, next) {
        const key = req.headers[IDEMPOTENCY_HEADER]?.trim();
        if (!key)
            return next();
        const endpoint = req.method + ' ' + (req.baseUrl || req.path);
        const userId = req.user?.user_id ?? null;
        const body = req.body ?? {};
        const requestHash = (0, crypto_1.createHash)('sha256').update(JSON.stringify(body)).digest('hex');
        try {
            const stored = await this.idempotencyService.check(key, endpoint, requestHash, userId);
            if (stored) {
                res.status(200).json(stored);
                return;
            }
            req.idempotencyKey = key;
            req.idempotencyRequestHash = requestHash;
            req.idempotencyEndpoint = endpoint;
            req.idempotencyUserId = userId;
            next();
        }
        catch (err) {
            next(err);
        }
    }
};
exports.IdempotencyMiddleware = IdempotencyMiddleware;
exports.IdempotencyMiddleware = IdempotencyMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [idempotency_service_1.IdempotencyService])
], IdempotencyMiddleware);
//# sourceMappingURL=idempotency.middleware.js.map