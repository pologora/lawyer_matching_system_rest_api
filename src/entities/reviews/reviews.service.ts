import { updateRatingQuery } from '../lawyers/sqlQueries';
import { CreateReviewService } from './types/reviewsTypes';

export const createReviewService: CreateReviewService =
  ({ buildCreateTableRowQuery, Review, LawyersProfile }) =>
  async ({ data }) => {
    const { query: createMessageQuery, values } = buildCreateTableRowQuery(data, 'Review');

    const caseId = await Review.create({ createMessageQuery, values });

    await LawyersProfile.updateRating({ id: data.lawyerId, updateRatingQuery });

    return await Review.getOne({ id: caseId! });
  };
