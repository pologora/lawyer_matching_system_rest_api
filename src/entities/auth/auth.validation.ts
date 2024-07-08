import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
