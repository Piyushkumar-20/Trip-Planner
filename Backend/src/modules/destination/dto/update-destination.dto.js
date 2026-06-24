import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class UpdateDestinationDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(5).max(50),
    description: Joi.string().trim().min(10).max(300),
    visitDate: Joi.date().iso(),
    visitTime: Joi.string(),
    estimatedCost: Joi.string(),
  }).min(1);
}

export default UpdateDestinationDto;
