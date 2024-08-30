import Joi from 'joi';

const PASSWORD_MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH);

export const userCreateSchema = Joi.object({
  confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match password.',
    'any.required': 'Confirm password is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address.',
    'string.empty': 'Email is required.',
  }),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({
      'any.required': 'Password is required.',
      'string.min': `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    }),
});

const ALLOWED_SORT_FIELDS = ['userId', 'email', 'googleId', 'role', 'active', 'createdAt', 'updatedAt'];

export const getManyUsersSchema = Joi.object({
  active: Joi.boolean().messages({
    'boolean.base': 'Active must be a boolean.',
  }),
  columns: Joi.string().messages({
    'string.base': 'Columns must be a string.',
  }),
  limit: Joi.number().integer().positive().messages({
    'number.base': 'Limit must be a number.',
    'number.integer': 'Limit must be an integer.',
    'number.positive': 'Limit must be a positive number.',
  }),
  order: Joi.string().valid('desc', 'asc').messages({
    'any.only': 'Order must be one of the following values: desc, asc.',
  }),
  page: Joi.number().integer().positive().messages({
    'number.base': 'Page must be a number.',
    'number.integer': 'Page must be an integer.',
    'number.positive': 'Page must be a positive number.',
  }),
  role: Joi.string().valid('admin', 'client', 'lawyer', 'user').messages({
    'any.only': 'Role must be one of the following values: admin, client, lawyer, user.',
  }),
  search: Joi.string().messages({
    'string.base': 'Search must be a string.',
  }),
  sort: Joi.string()
    .valid(...ALLOWED_SORT_FIELDS)
    .messages({
      'any.only': `Sort must be one of the following values: ${ALLOWED_SORT_FIELDS.join(', ')}.`,
      'string.base': 'Sort must be a string.',
    }),
});

export const userUpdateSchema = Joi.object({
  isVerified: Joi.boolean().messages({
    'any.isVerified': 'isVerified must be boolean.',
  }),
  role: Joi.string().valid('admin', 'client', 'lawyer').messages({
    'any.only': 'Role must be one of the following values: admin, client, lawyer, user.',
  }),
});
