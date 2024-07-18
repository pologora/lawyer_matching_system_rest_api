import Joi from 'joi';

const passwordMinLength = 3;

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string()
    .min(passwordMinLength)
    .required()
    .messages({
      'string.min': `Password must be at least ${passwordMinLength} characters`,
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match password',
    'any.required': 'Confirm password is required',
  }),
});

export const userUpdateSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  role: Joi.string().valid('admin', 'client', 'lawyer').messages({
    'any.only': 'Role must be one of the following values: admin, client, lawyer',
  }),
});
