import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    fullName: Joi.string().required().min(2).max(50),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
      .min(8)
      .pattern(/(?=.*[A-Z])(?=.*\d)/)
      .message(
        "Password must contain at least one uppercase letter and one digit",
      )
      .required(),
  });
}

export default RegisterDto