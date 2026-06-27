import Joi from "joi";

const updateActivityDto = Joi.object({
  title: Joi.string().trim().min(5).max(50),

  description: Joi.string()
    .trim()
    .min(10)
    .max(300)
    .allow(""),

  visitDate: Joi.date(),

  startTime: Joi.string(),

  endTime: Joi.string(),

  estimatedCost: Joi.string().trim().min(1),
}).min(1);

export default updateActivityDto;
