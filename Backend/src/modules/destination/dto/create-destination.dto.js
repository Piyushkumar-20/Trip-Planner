import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class CreateDestinationDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(5).max(50).required(),
    description: Joi.string().trim().min(10).max(300).required(),
    visitDate: Joi.date().iso().required(),
    visitTime: Joi.string().required(),
    estimatedCost: Joi.string().required(),
  });
}

export default CreateDestinationDto;
