"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationIdMiddleware = correlationIdMiddleware;
const uuid_1 = require("uuid");
const HEADER = 'x-correlation-id';
function correlationIdMiddleware(req, res, next) {
    const id = req.headers[HEADER]?.trim() || (0, uuid_1.v4)();
    req.headers[HEADER] = id;
    req.correlationId = id;
    res.setHeader('X-Correlation-ID', id);
    next();
}
//# sourceMappingURL=correlation-id.middleware.js.map