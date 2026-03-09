"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_guard_1 = require("./jwt.guard");
describe('JwtAuthGuard', () => {
    let guard;
    let reflector;
    beforeEach(() => {
        reflector = {
            getAllAndOverride: jest.fn(),
        };
        guard = new jwt_guard_1.JwtAuthGuard(reflector);
    });
    it('should allow access when route is public', () => {
        reflector.getAllAndOverride.mockReturnValue(true);
        const context = {
            getHandler: () => ({}),
            getClass: () => ({}),
            switchToHttp: () => ({ getRequest: () => ({}) }),
        };
        expect(guard.canActivate(context)).toBe(true);
    });
    it('should delegate to passport when not public', () => {
        reflector.getAllAndOverride.mockReturnValue(false);
        const context = {
            getHandler: () => ({}),
            getClass: () => ({}),
            switchToHttp: () => ({ getRequest: () => ({}) }),
        };
        const result = guard.canActivate(context);
        expect(result).toBeInstanceOf(Promise);
    });
});
//# sourceMappingURL=jwt.guard.spec.js.map