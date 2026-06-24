import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class AddMemberDto extends BaseDto {
  
  static schema = Joi.object({
    tripId: Joi.string()
      .pattern(/^[a-f\d]{24}$/i)
      .messages({ "string.pattern.base": "tripId must be a valid ObjectId" }),
    email: Joi.string().email().lowercase().required(),
    role: Joi.string().valid("Editor", "Viewer").default("Viewer"),
  });
}

export default AddMemberDto;
