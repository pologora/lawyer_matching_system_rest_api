import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  user_id: Joi.number().required(),
  experience: Joi.number().required(),
  license_number: Joi.string().required(),
  bio: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  city: Joi.string().required(),
  region: Joi.string().required(),
  specializations: Joi.array().items(Joi.number()).required(),
});

export const lawyerUpdateSchema = Joi.object({
  experience: Joi.number(),
  license_number: Joi.string(),
  rating: Joi.number(),
  bio: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  city: Joi.string(),
  region: Joi.string(),
  specializations: Joi.array().items(Joi.number()),
});
