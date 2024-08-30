import { updateRatingQuery } from '../lawyers/sqlQueries';
import { CreateReviewService } from './types/reviewsTypes';

export const createReviewService: CreateReviewService = async ({
  buildInsertQuery,
  Review,
  LawyersProfile,
  getReviewQuery,
  data,
}) => {
  const { query, values } = buildInsertQuery(data, 'Review');

  const caseId = await Review.create({ query, values });

  await LawyersProfile.updateRating({ id: data.lawyerId, updateRatingQuery });

  return await Review.getOne({ id: caseId!, query: getReviewQuery });
};
