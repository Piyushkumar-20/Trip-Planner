import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class CreateTripDto extends BaseDto {
  static schema = Joi.object({
    title: Joi.string().trim().min(5).max(50).required(),
    description: Joi.string().trim().min(10).max(300).required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref("startDate")).required().messages({
      "date.greater": "End date must be after start date",
    }),
  });
}

export default CreateTripDto;
