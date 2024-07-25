import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  bio: Joi.string().required(),
  city: Joi.string().required(),
  experience: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  region: Joi.string().required(),
  specializations: Joi.array().items(Joi.number()).required(),
  userId: Joi.number().required(),
});

export const lawyerUpdateSchema = Joi.object({
  bio: Joi.string(),
  city: Joi.string(),
  experience: Joi.number(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  licenseNumber: Joi.string(),
  rating: Joi.number(),
  region: Joi.string(),
  specializations: Joi.array().items(Joi.number()),
});

const ALLOWED_SORT_FIELDS = [
  'experience',
  'city',
  'region',
  'rating',
  'firstName',
  'lastName',
  'createdAt',
  'updatedAt',
];

export const getManyLawyersQuerySchema = Joi.object({
  city: Joi.string(),
  experienceMax: Joi.number(),
  experienceMin: Joi.number(),
  limit: Joi.number(),
  order: Joi.valid('desc', 'asc'),
  page: Joi.number(),
  ratingMax: Joi.number(),
  ratingMin: Joi.number(),
  region: Joi.number(),
  search: Joi.string(),
  sort: Joi.valid(...ALLOWED_SORT_FIELDS),
  specialization: Joi.number(),
});
