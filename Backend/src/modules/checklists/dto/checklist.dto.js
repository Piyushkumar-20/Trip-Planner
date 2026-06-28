import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class CreateChecklistDto extends BaseDto {
  static schema = Joi.object({
    type: Joi.string().valid("Packing", "Shared").required(),
  });
}


export default CreateChecklistDto;
