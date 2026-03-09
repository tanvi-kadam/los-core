"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthorityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_authority_dto_1 = require("./create-authority.dto");
class UpdateAuthorityDto extends (0, swagger_1.PartialType)(create_authority_dto_1.CreateAuthorityDto) {
}
exports.UpdateAuthorityDto = UpdateAuthorityDto;
//# sourceMappingURL=update-authority.dto.js.map