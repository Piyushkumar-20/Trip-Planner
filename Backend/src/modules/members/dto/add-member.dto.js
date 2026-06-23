import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class AddMemberDto extends BaseDto {
  static schema = Joi.object({
    tripId: Joi.string()
      .pattern(/^[a-f\d]{24}$/i)
      .required()
      .messages({ "string.pattern.base": "tripId must be a valid ObjectId" }),
    userId: Joi.string()
      .pattern(/^[a-f\d]{24}$/i)
      .required()
      .messages({ "string.pattern.base": "userId must be a valid ObjectId" }),
    role: Joi.string().valid("Owner", "Editor", "Viewer").default("Viewer"),
  });
}

export default AddMemberDto;
