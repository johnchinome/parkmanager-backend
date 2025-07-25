import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  cellphone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Cellphone must have exactly 10 digits",
    }),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  cellphone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Cellphone must have exactly 10 digits",
    }),
  password: Joi.string().required(),
});
