import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  userId: Joi.number().required(),
  experience: Joi.number().required(),
  licenseNumber: Joi.string().required(),
  bio: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  city: Joi.string().required(),
  region: Joi.string().required(),
  specializations: Joi.array().items(Joi.number()).required(),
});

export const lawyerUpdateSchema = Joi.object({
  experience: Joi.number(),
  licenseNumber: Joi.string(),
  rating: Joi.number(),
  bio: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  city: Joi.string(),
  region: Joi.string(),
  specializations: Joi.array().items(Joi.number()),
});

export const getManyLawyersQuerySchema = Joi.object({
  experienceMin: Joi.number(),
  experienceMax: Joi.number(),
  city: Joi.string(),
  region: Joi.number(),
  ratingMax: Joi.number(),
  ratingMin: Joi.number(),
  limit: Joi.number(),
  order: Joi.allow('desc', 'asc'),
  page: Joi.number(),
  search: Joi.string(),
  sort: Joi.string(),
  specialization: Joi.number(),
});
