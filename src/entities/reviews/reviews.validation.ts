import Joi from 'joi';

const minRating = 1;
const maxRating = 5;

export const createReviewSchema = Joi.object({
  clientId: Joi.number().required(),
  lawyerId: Joi.number().required(),
  rating: Joi.number().required().min(minRating).max(maxRating),
  reviewText: Joi.string().required(),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(minRating).max(maxRating),
  reviewText: Joi.string(),
});

const sortByValues = ['createdAt', 'rating'];
export const getManyReviewsShema = Joi.object({
  clientId: Joi.number(),
  endDate: Joi.date(),
  lawyerId: Joi.number(),
  limit: Joi.number(),
  page: Joi.number(),
  ratingMax: Joi.number().max(maxRating).min(minRating),
  ratingMin: Joi.number().min(minRating).max(maxRating),
  search: Joi.string(),
  sortBy: Joi.valid(...sortByValues),
  sortOrder: Joi.valid('desc', 'asc'),
  startDate: Joi.date(),
});
