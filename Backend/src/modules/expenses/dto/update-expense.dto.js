import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class UpdateExpenseDto extends BaseDto {
  static schema = Joi.object({
    title: Joi.string().trim().min(5).max(50),
    note: Joi.string().trim().min(5).max(20),
    amount: Joi.number().min(1),
    category: Joi.string().valid("Food", "Hotel", "Transport", "Shopping", "Other"),
  }).min(1);
}

export default UpdateExpenseDto;
