import Joi from 'joi';

export const clientCreateSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required.',
    'string.base': 'First name must be a string value.',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required.',
    'string.base': 'Last name must be a string value.',
  }),
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required.',
    'number.base': 'User ID must be a numeric value.',
  }),
});

export const clientUpdateSchema = Joi.object({
  firstName: Joi.string().messages({
    'string.base': 'First name must be a string value.',
  }),
  lastName: Joi.string().messages({
    'string.base': 'Last name must be a string value.',
  }),
});
