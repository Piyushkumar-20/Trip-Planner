import Joi from "joi";

const createActivityDto = Joi.object({
  title: Joi.string().trim().min(5).max(50).required(),

  description: Joi.string()
    .trim()
    .min(10)
    .max(300)
    .optional()
    .allow(""),

  visitDate: Joi.date().required(),

  startTime: Joi.string().required(),

  endTime: Joi.string().required(),

  estimatedCost: Joi.string().required(),
});

export default createActivityDto