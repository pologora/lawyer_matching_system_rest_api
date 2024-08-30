import Joi from 'joi';

const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH!);

export const userRegistrationSchema = Joi.object({
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match password.',
    'any.required': 'Confirm password is required.',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const forgotPasswordShema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
});

export const resetPasswordSchema = Joi.object({
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match password.',
    'any.required': 'Confirm password is required.',
  }),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({
      'any.required': 'Password is required.',
      'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    }),
  resetToken: Joi.string().required().messages({
    'string.empty': 'Token is required.',
  }),
});

export const changeMyPasswordSchema = Joi.object({
  confirmNewPassword: Joi.any().equal(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password does not match password.',
    'any.required': 'Confirm password is required.',
  }),
  newPassword: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({
      'any.required': 'Password is required.',
      'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});

export const deleteMeSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
  }),
});
