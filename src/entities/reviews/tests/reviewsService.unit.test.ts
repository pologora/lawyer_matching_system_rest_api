/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */

import { RowDataPacket } from 'mysql2';
import { BuildInsertQuery } from '../../../types/utils';
import { updateRatingQuery } from '../../lawyers/sqlQueries';
import { LawyersProfileModel } from '../../lawyers/types/lawyersTypes';
import { createReviewService } from '../reviews.service';
import { getReviewQuery } from '../sqlQueries';
import { CreateReviewDto, ReviewModel } from '../types/reviewsTypes';

const data = {
  lawyerId: 1,
  reviewText: 'Great lawyer!',
  rating: 5,
} as unknown as CreateReviewDto;

describe('createReviewService', () => {
  let buildCreateTableRowQueryMock: jest.MockedFunction<BuildInsertQuery>;
  let ReviewMock: jest.Mocked<ReviewModel>;
  let LawyersProfileMock: jest.Mocked<LawyersProfileModel>;

  beforeEach(() => {
    buildCreateTableRowQueryMock = jest.fn();
    ReviewMock = {
      create: jest.fn(),
      getOne: jest.fn(),
    } as unknown as jest.Mocked<ReviewModel>;
    LawyersProfileMock = {
      updateRating: jest.fn(),
    } as unknown as jest.Mocked<LawyersProfileModel>;

    jest.clearAllMocks();
  });

  it('should create a review and update the lawyer rating', async () => {
    buildCreateTableRowQueryMock.mockReturnValue({
      query: 'INSERT INTO Review (reviewText, rating, lawyerId) VALUES (?, ?, ?)',
      values: [data.reviewText, data.rating, data.lawyerId],
    });

    ReviewMock.create.mockResolvedValueOnce(1);
    ReviewMock.getOne.mockResolvedValueOnce({
      id: 1,
      ...data,
    } as RowDataPacket);

    const service = createReviewService({
      buildCreateTableRowQuery: buildCreateTableRowQueryMock,
      Review: ReviewMock,
      LawyersProfile: LawyersProfileMock,
      getReviewQuery,
    });

    const result = await service({ data });

    expect(buildCreateTableRowQueryMock).toHaveBeenCalledWith(data, 'Review');
    expect(ReviewMock.create).toHaveBeenCalledWith({
      query: 'INSERT INTO Review (reviewText, rating, lawyerId) VALUES (?, ?, ?)',
      values: [data.reviewText, data.rating, data.lawyerId],
    });
    expect(LawyersProfileMock.updateRating).toHaveBeenCalledWith({
      id: data.lawyerId,
      updateRatingQuery,
    });
    expect(ReviewMock.getOne).toHaveBeenCalledWith({
      id: 1,
      query: getReviewQuery,
    });
    expect(result).toEqual({
      id: 1,
      ...data,
    });
  });

  it('should throw an error if creating review fails', async () => {
    buildCreateTableRowQueryMock.mockReturnValue({
      query: 'INSERT INTO Review (reviewText, rating, lawyerId) VALUES (?, ?, ?)',
      values: [data.reviewText, data.rating, data.lawyerId],
    });

    ReviewMock.create.mockRejectedValueOnce(new Error('Failed to create review'));

    const service = createReviewService({
      buildCreateTableRowQuery: buildCreateTableRowQueryMock,
      Review: ReviewMock,
      LawyersProfile: LawyersProfileMock,
      getReviewQuery,
    });

    await expect(service({ data })).rejects.toThrow('Failed to create review');
  });

  it('should throw an error if updating lawyer rating fails', async () => {
    buildCreateTableRowQueryMock.mockReturnValue({
      query: 'INSERT INTO Review (reviewText, rating, lawyerId) VALUES (?, ?, ?)',
      values: [data.reviewText, data.rating, data.lawyerId],
    });

    ReviewMock.create.mockResolvedValueOnce(1);
    LawyersProfileMock.updateRating.mockRejectedValueOnce(new Error('Failed to update rating'));

    const service = createReviewService({
      buildCreateTableRowQuery: buildCreateTableRowQueryMock,
      Review: ReviewMock,
      LawyersProfile: LawyersProfileMock,
      getReviewQuery,
    });

    await expect(service({ data })).rejects.toThrow('Failed to update rating');
  });
});
