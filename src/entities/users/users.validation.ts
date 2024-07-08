import Joi from 'joi';

export const userCreateSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.pattern.base': 'Password must be between 3 and 30 characters and contain only alphanumeric characters',
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
