import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  experience: Joi.number().required(),
  license_number: Joi.string().required(),
  bio: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  city: Joi.string().required(),
  region: Joi.string().required(),
  specializations: Joi.array().items(Joi.string()).required(),
});
