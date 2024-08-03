import Joi from 'joi';

const minRating = 1;
const maxRating = 5;

export const createReviewSchema = Joi.object({
  clientId: Joi.number().required().messages({
    'any.required': 'Client ID is required.',
    'number.base': 'Client ID must be a numeric value.',
  }),
  lawyerId: Joi.number().required().messages({
    'any.required': 'Lawyer ID is required.',
    'number.base': 'Lawyer ID must be a numeric value.',
  }),
  rating: Joi.number()
    .required()
    .min(minRating)
    .max(maxRating)
    .messages({
      'any.required': 'Rating is required.',
      'number.base': 'Rating must be a numeric value.',
      'number.max': `Rating must be at most ${maxRating}.`,
      'number.min': `Rating must be at least ${minRating}.`,
    }),
  reviewText: Joi.string().required().messages({
    'any.required': 'Review text is required.',
    'string.base': 'Review text must be a string.',
  }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .min(minRating)
    .max(maxRating)
    .messages({
      'number.base': 'Rating must be a numeric value.',
      'number.max': `Rating must be at most ${maxRating}.`,
      'number.min': `Rating must be at least ${minRating}.`,
    }),
  reviewText: Joi.string().messages({
    'string.base': 'Review text must be a string.',
  }),
});

const sortByValues = ['createdAt', 'rating'];
export const getManyReviewsSchema = Joi.object({
  clientId: Joi.number().messages({
    'number.base': 'Client ID must be a numeric value.',
  }),
  endDate: Joi.date().messages({
    'date.base': 'End date must be a valid date.',
  }),
  lawyerId: Joi.number().messages({
    'number.base': 'Lawyer ID must be a numeric value.',
  }),
  limit: Joi.number().messages({
    'number.base': 'Limit must be a numeric value.',
  }),
  page: Joi.number().messages({
    'number.base': 'Page must be a numeric value.',
  }),
  ratingMax: Joi.number()
    .max(maxRating)
    .min(minRating)
    .messages({
      'number.base': 'Maximum rating must be a numeric value.',
      'number.max': `Maximum rating must be at most ${maxRating}.`,
      'number.min': `Maximum rating must be at least ${minRating}.`,
    }),
  ratingMin: Joi.number()
    .min(minRating)
    .max(maxRating)
    .messages({
      'number.base': 'Minimum rating must be a numeric value.',
      'number.max': `Minimum rating must be at most ${maxRating}.`,
      'number.min': `Minimum rating must be at least ${minRating}.`,
    }),
  search: Joi.string().messages({
    'string.base': 'Search must be a string.',
  }),
  sortBy: Joi.string()
    .valid(...sortByValues)
    .messages({
      'any.only': `Sort by must be one of the following values: ${sortByValues.join(', ')}.`,
      'string.base': 'Sort by must be a string.',
    }),
  sortOrder: Joi.string().valid('desc', 'asc').messages({
    'any.only': 'Sort order must be either "desc" or "asc".',
    'string.base': 'Sort order must be a string.',
  }),
  startDate: Joi.date().messages({
    'date.base': 'Start date must be a valid date.',
  }),
});
