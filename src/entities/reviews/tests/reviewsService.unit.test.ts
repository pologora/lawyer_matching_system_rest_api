/* eslint-disable no-magic-numbers */
import { updateRatingQuery } from '../../lawyers/sqlQueries';
import { LawyerModel } from '../../lawyers/types/lawyersTypes';
import { createReviewService } from '../reviewService';
import { getReviewQuery } from '../sqlQueries';
import { ReviewModel } from '../types/reviewsTypes';

/* eslint-disable sort-keys */
describe('reviewService', () => {
  const mockReviewCreate = jest.fn();
  const mockReviewGetOne = jest.fn();
  const mockLawyerUpdateRating = jest.fn();
  const mockBuildInsertQuery = jest.fn();
  const mockLawyer = { updateRating: mockLawyerUpdateRating };
  const mockReview = { create: mockReviewCreate, getOne: mockReviewGetOne };

  const data = { reviewId: 4, clientId: 1, lawyerId: 1, reviewText: 'All good', rating: 5 };
  describe('createReviewService', () => {
    it('should return new review record', async () => {
      const query = 'Query';
      const values = [4, 1];
      const reviewId = 1;

      mockBuildInsertQuery.mockReturnValue({ query, values });
      mockReviewCreate.mockReturnValue(reviewId);
      mockLawyerUpdateRating.mockResolvedValue(undefined);
      mockReviewGetOne.mockResolvedValue(data);

      const result = await createReviewService({
        data,
        buildInsertQuery: mockBuildInsertQuery,
        getReviewQuery,
        updateRatingQuery,
        Lawyer: mockLawyer as unknown as LawyerModel,
        Review: mockReview as unknown as ReviewModel,
      });

      expect(mockBuildInsertQuery).toHaveBeenCalledWith(data, 'Review');
      expect(mockReviewCreate).toHaveBeenCalledWith({ query, values });
      expect(mockLawyerUpdateRating).toHaveBeenCalledWith({ id: reviewId, updateRatingQuery });
      expect(mockReviewGetOne).toHaveBeenCalledWith({ id: reviewId, query: getReviewQuery });
      expect(result).toEqual(data);
    });
  });
});

// export const createReviewService: CreateReviewService = async ({
//   buildInsertQuery,
//   Review,
//   Lawyer,
//   getReviewQuery,
//   data,
// }) => {
//   const { query, values } = buildInsertQuery(data, 'Review');

//   const caseId = await Review.create({ query, values });

//   await Lawyer.updateRating({ id: data.lawyerId, updateRatingQuery });

//   return await Review.getOne({ id: caseId!, query: getReviewQuery });
// };
