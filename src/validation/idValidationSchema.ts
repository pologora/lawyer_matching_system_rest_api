import Joi from 'joi';

export const idValidationSchema = Joi.object({
  id: Joi.number().positive().required().messages({
    'any.required': 'Id is required',
    'number.base': 'Id must be a number',
    'number.positive': 'Id must be a positive number',
  }),
});
