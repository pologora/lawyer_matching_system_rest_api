import Joi from 'joi';

export const clientCreateSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userId: Joi.number().required(),
});

export const clientUpdateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});
