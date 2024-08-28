import { updateRatingQuery } from '../lawyers/sqlQueries';
import { CreateReviewService } from './types/reviewsTypes';

export const createReviewService: CreateReviewService =
  ({ buildCreateTableRowQuery, Review, LawyersProfile, getReviewQuery }) =>
  async ({ data }) => {
    const { query, values } = buildCreateTableRowQuery(data, 'Review');

    const caseId = await Review.create({ query, values });

    await LawyersProfile.updateRating({ id: data.lawyerId, updateRatingQuery });

    return await Review.getOne({ id: caseId!, query: getReviewQuery });
  };
