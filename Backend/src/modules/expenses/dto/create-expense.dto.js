import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class CreateExpenseDto extends BaseDto {
  static schema = Joi.object({
    title: Joi.string().trim().min(5).max(50).required(),
    note: Joi.string().trim().min(5).max(20),
    amount: Joi.number().min(1).required(),
    category: Joi.string()
      .valid("Food", "Hotel", "Transport", "Shopping", "Other")
      .required(),
  });
}

export default CreateExpenseDto;
