import Joi from 'joi';
import { PASSWORD_MIN_LENGTH } from '../../config/constants';

export const userCreateSchema = Joi.object({
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match password',
    'any.required': 'Confirm password is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({
      'any.required': 'Password is required',
      'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }),
});

export const userUpdateSchema = Joi.object({
  active: Joi.boolean().messages({
    'any.active': 'Active must be boolean',
  }),
  role: Joi.string().valid('admin', 'client', 'lawyer').messages({
    'any.only': 'Role must be one of the following values: admin, client, lawyer, user',
  }),
});
