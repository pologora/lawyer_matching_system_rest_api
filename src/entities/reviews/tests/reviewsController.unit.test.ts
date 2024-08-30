/* eslint-disable max-lines-per-function */
/* eslint-disable sort-keys */
import { Request, Response, NextFunction } from 'express';
import { ReviewController } from '../ReviewController';
import { LawyerModel } from '../../lawyers/types/lawyersTypes';
import { ReviewModel } from '../types/reviewsTypes';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

describe('ReviewController', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const body = {
    email: 'test@example.com',
    password: 'password123',
  };

  const req = {
    body,
  } as unknown as Request;

  const next = jest.fn() as NextFunction;

  const mockCreateReviewService = jest.fn();
  const mockQuery = 'Query';

  const reviewController = new ReviewController({
    buildGetManyReviewsQuery: jest.fn(),
    createReviewService: mockCreateReviewService,
    getReviewQuery: mockQuery,
    Lawyer: jest.fn() as unknown as LawyerModel,
    Review: jest.fn() as unknown as ReviewModel,
    updateRatingQuery: mockQuery,
  });

  describe('create', () => {
    it('should return response with created review', async () => {
      const mockReview = { reviewId: 1, reviewText: 'some text' };
      mockCreateReviewService.mockResolvedValue(mockReview);

      await reviewController.create(req, res, next);

      expect(mockCreateReviewService).toHaveBeenCalledWith({
        Lawyer: expect.any(Function),
        Review: expect.any(Function),
        buildInsertQuery: expect.any(Function),
        data: req.body,
        getReviewQuery: expect.any(String),
        updateRatingQuery: expect.any(String),
      });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED_201);
      expect(res.json).toHaveBeenCalledWith({
        data: mockReview,
        message: 'Successfully created new review',
        status: 'success',
      });
    });
  });
});
