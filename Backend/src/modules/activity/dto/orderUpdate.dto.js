import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js"
class ReorderActivityDto extends BaseDto {
  static schema = Joi.object({
    activities: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          order: Joi.number().integer().min(1).required(),
        })
      )
      .min(1)
      .required(),
  });
}

export default ReorderActivityDto;