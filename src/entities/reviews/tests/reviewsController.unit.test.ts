/* eslint-disable sort-keys */
import { Request, Response } from 'express';
import { LawyerModel } from '../../lawyers/types/lawyersTypes';
import { ReviewController } from '../ReviewController';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import { updateRatingQuery } from '../../lawyers/sqlQueries';

describe('ReviewController', () => {
  const data = { reviewId: 4, clientId: 1, lawyerId: 1, reviewText: 'All good', rating: 5 };
  const mockCreateReviewService = jest.fn();
  const mockLawyer = jest.fn();
  const req = {
    body: data,
  } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
  const reviewController = new ReviewController({
    Lawyer: mockLawyer as unknown as LawyerModel,
    createReviewService: mockCreateReviewService,
    updateRatingQuery,
  });
  describe('create', () => {
    it('should create review and send response', async () => {
      mockCreateReviewService.mockResolvedValue(data);

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
        data,
        message: 'Successfully created new review',
        status: 'success',
      });
    });
  });
});
