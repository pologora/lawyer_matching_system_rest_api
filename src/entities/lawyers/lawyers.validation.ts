import Joi from 'joi';

export const lawyerCreateSchema = Joi.object({
  bio: Joi.string().required().messages({
    'any.required': 'Bio is required.',
    'string.base': 'Bio must be a string value.',
  }),
  cityId: Joi.number().required().messages({
    'any.required': 'City ID is required.',
    'number.base': 'City ID must be a numeric value.',
  }),
  experience: Joi.number().required().messages({
    'any.required': 'Experience is required.',
    'number.base': 'Experience must be a numeric value.',
  }),
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required.',
    'string.base': 'First name must be a string value.',
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required.',
    'string.base': 'Last name must be a string value.',
  }),
  licenseNumber: Joi.string().required().messages({
    'any.required': 'License number is required.',
    'string.base': 'License number must be a string value.',
  }),
  regionId: Joi.number().required().messages({
    'any.required': 'Region ID is required.',
    'number.base': 'Region ID must be a numeric value.',
  }),
  specializations: Joi.array().items(Joi.number()).required().messages({
    'any.required': 'Specializations are required.',
    'array.base': 'Specializations must be an array of numbers.',
  }),
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required.',
    'number.base': 'User ID must be a numeric value.',
  }),
});

export const lawyerUpdateSchema = Joi.object({
  bio: Joi.string().messages({
    'string.base': 'Bio must be a string value.',
  }),
  cityId: Joi.number().messages({
    'number.base': 'City ID must be a numeric value.',
  }),
  experience: Joi.number().messages({
    'number.base': 'Experience must be a numeric value.',
  }),
  firstName: Joi.string().messages({
    'string.base': 'First name must be a string value.',
  }),
  lastName: Joi.string().messages({
    'string.base': 'Last name must be a string value.',
  }),
  licenseNumber: Joi.string().messages({
    'string.base': 'License number must be a string value.',
  }),
  rating: Joi.number().messages({
    'number.base': 'Rating must be a numeric value.',
  }),
  regionId: Joi.number().messages({
    'number.base': 'Region ID must be a numeric value.',
  }),
  specializations: Joi.array().items(Joi.number()).messages({
    'array.base': 'Specializations must be an array of numbers.',
  }),
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
  cityId: Joi.number().messages({
    'number.base': 'City ID must be a numeric value.',
  }),
  experienceMax: Joi.number().messages({
    'number.base': 'Maximum experience must be a numeric value.',
  }),
  experienceMin: Joi.number().messages({
    'number.base': 'Minimum experience must be a numeric value.',
  }),
  limit: Joi.number().messages({
    'number.base': 'Limit must be a numeric value.',
  }),
  order: Joi.string().valid('desc', 'asc').messages({
    'any.only': 'Order must be either "desc" or "asc".',
  }),
  page: Joi.number().messages({
    'number.base': 'Page must be a numeric value.',
  }),
  ratingMax: Joi.number().messages({
    'number.base': 'Maximum rating must be a numeric value.',
  }),
  ratingMin: Joi.number().messages({
    'number.base': 'Minimum rating must be a numeric value.',
  }),
  regionId: Joi.number().messages({
    'number.base': 'Region ID must be a numeric value.',
  }),
  search: Joi.string().messages({
    'string.base': 'Search must be a string value.',
  }),
  sort: Joi.string()
    .valid(...ALLOWED_SORT_FIELDS)
    .messages({
      'any.only': `Sort must be one of the following values: ${ALLOWED_SORT_FIELDS.join(', ')}.`,
      'string.base': 'Sort must be a string value.',
    }),
  specialization: Joi.number().messages({
    'number.base': 'Specialization ID must be a numeric value.',
  }),
});
