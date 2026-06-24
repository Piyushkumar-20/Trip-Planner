import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class UpdateMemberRoleDto extends BaseDto {
  static schema = Joi.object({
    role: Joi.string().valid("Editor", "Viewer").required(),
  });
}

export default UpdateMemberRoleDto;
