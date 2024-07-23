import Joi from 'joi';

export const clientCreateSchema = Joi.object({
  userId: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const clientUpdateSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
});
