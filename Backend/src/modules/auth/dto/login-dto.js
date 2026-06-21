import Joi from "joi";
import BaseDto from "../../../common/dto/base-dto.js";

class LoginDto extends BaseDto {
  static schema = Joi.object({
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

export default LoginDto;
