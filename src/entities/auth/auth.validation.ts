import Joi from 'joi';

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const forgotPasswordShema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
  }),
});

export const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required().messages({
    'string.empty': 'Token is required',
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

export const changeMyPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
  newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
    'string.pattern.base': 'Password must be between 3 and 30 characters and contain only alphanumeric characters',
    'any.required': 'Password is required',
  }),
  confirmNewPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password does not match password',
    'any.required': 'Confirm password is required',
  }),
});

export const deleteMeSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
