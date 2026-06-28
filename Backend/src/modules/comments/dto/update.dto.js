import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class UpdateCommentDto extends BaseDto {
  static schema = Joi.object({
    content: Joi.string().trim().min(1).max(1000).required(),
  });
}

export default UpdateCommentDto;
