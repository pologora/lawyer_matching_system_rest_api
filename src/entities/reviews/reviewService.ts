import { CreateReviewService } from './types/reviewsTypes';

export const createReviewService: CreateReviewService = async ({
  buildInsertQuery,
  Review,
  Lawyer,
  getReviewQuery,
  updateRatingQuery,
  data,
}) => {
  const { query, values } = buildInsertQuery(data, 'Review');

  const reviewId = await Review.create({ query, values });

  await Lawyer.updateRating({ id: data.lawyerId, updateRatingQuery });

  return await Review.getOne({ id: reviewId!, query: getReviewQuery });
};
