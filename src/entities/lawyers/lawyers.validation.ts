import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  bio: Joi.string().required(),
  cityId: Joi.number().required(),
  experience: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  regionId: Joi.number().required(),
  specializations: Joi.array().items(Joi.number()).required(),
  userId: Joi.number().required(),
});

export const lawyerUpdateSchema = Joi.object({
  bio: Joi.string(),
  cityId: Joi.number(),
  experience: Joi.number(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  licenseNumber: Joi.string(),
  rating: Joi.number(),
  regionId: Joi.number(),
  specializations: Joi.array().items(Joi.number()),
});

const ALLOWED_SORT_FIELDS = [
  'experience',
  'cityId',
  'regionId',
  'rating',
  'firstName',
  'lastName',
  'createdAt',
  'updatedAt',
];

export const getManyLawyersQuerySchema = Joi.object({
  cityId: Joi.number(),
  experienceMax: Joi.number(),
  experienceMin: Joi.number(),
  limit: Joi.number(),
  order: Joi.valid('desc', 'asc'),
  page: Joi.number(),
  ratingMax: Joi.number(),
  ratingMin: Joi.number(),
  regionId: Joi.number(),
  search: Joi.string(),
  sort: Joi.valid(...ALLOWED_SORT_FIELDS),
  specialization: Joi.number(),
});
