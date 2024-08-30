/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import {
  createReviewController,
  getManyReviewsController,
  getReviewController,
  removeReviewController,
  updateReviewController,
} from '../ReviewController';
import { Request, Response, NextFunction } from 'express';
import { ReviewModel } from '../types/reviewsTypes';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.end = jest.fn().mockReturnThis();
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe('createReviewController', () => {
  const createReviewServiceMock = jest.fn();
  const req = {
    body: {
      clientId: 1,
      lawyerId: 1,
      reviewText: 'Great lawyer!',
      rating: 5,
    },
  } as unknown as Request;

  it('should create a review and return the result', async () => {
    const res = mockResponse();
    createReviewServiceMock.mockResolvedValueOnce({ id: 1, ...req.body });

    const controller = createReviewController({ createReviewService: createReviewServiceMock });

    await controller(req, res, mockNext);

    expect(createReviewServiceMock).toHaveBeenCalledWith({ data: req.body });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED_201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Successfully created new review',
      data: { id: 1, ...req.body },
    });
  });
});

describe('getReviewController', () => {
  const ReviewMock = {
    getOne: jest.fn(),
  };
  const req = {
    params: {
      id: '1',
    },
  } as unknown as Request;

  it('should return a single review', async () => {
    const res = mockResponse();
    ReviewMock.getOne.mockResolvedValueOnce({ id: 1, reviewText: 'Great lawyer!', rating: 5 });

    const controller = getReviewController({
      Review: ReviewMock as unknown as ReviewModel,
      query: 'SELECT * FROM Reviews WHERE id = ?',
    });

    await controller(req, res, mockNext);

    expect(ReviewMock.getOne).toHaveBeenCalledWith({ id: 1, query: 'SELECT * FROM Reviews WHERE id = ?' });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Review retrieved successfully',
      data: { id: 1, reviewText: 'Great lawyer!', rating: 5 },
    });
  });
});

describe('getManyReviewsController', () => {
  const ReviewMock = {
    getMany: jest.fn(),
  };
  const buildGetManyReviewsQueryMock = jest.fn();
  const req = {
    query: {
      lawyerId: '1',
    },
  } as unknown as Request;

  it('should return a list of reviews', async () => {
    const res = mockResponse();
    buildGetManyReviewsQueryMock.mockReturnValue({
      query: 'SELECT * FROM Reviews WHERE lawyerId = ?',
      values: [1],
    });
    ReviewMock.getMany.mockResolvedValueOnce([
      { id: 1, reviewText: 'Great lawyer!', rating: 5 },
      { id: 2, reviewText: 'Very helpful!', rating: 4 },
    ]);

    const controller = getManyReviewsController({
      Review: ReviewMock as unknown as ReviewModel,
      buildGetManyReviewsQuery: buildGetManyReviewsQueryMock,
    });

    await controller(req, res, mockNext);

    expect(buildGetManyReviewsQueryMock).toHaveBeenCalledWith(req.query);
    expect(ReviewMock.getMany).toHaveBeenCalledWith({
      query: 'SELECT * FROM Reviews WHERE lawyerId = ?',
      values: [1],
    });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Reviews retrieved successfully',
      data: [
        { id: 1, reviewText: 'Great lawyer!', rating: 5 },
        { id: 2, reviewText: 'Very helpful!', rating: 4 },
      ],
    });
  });
});

describe('updateReviewController', () => {
  const ReviewMock = {
    update: jest.fn(),
    getOne: jest.fn(),
  };
  const buildUpdateTableRowQueryMock = jest.fn();
  const req = {
    params: { id: '1' },
    body: {
      reviewText: 'Updated review text',
      rating: 4,
    },
  } as unknown as Request;

  it('should update a review and return the updated review', async () => {
    const res = mockResponse();
    buildUpdateTableRowQueryMock.mockReturnValue({
      query: 'UPDATE Reviews SET reviewText = ?, rating = ? WHERE id = ?',
      values: ['Updated review text', 4],
    });
    ReviewMock.update.mockResolvedValueOnce(undefined);
    ReviewMock.getOne.mockResolvedValueOnce({ id: 1, reviewText: 'Updated review text', rating: 4 });

    const controller = updateReviewController({
      Review: ReviewMock as unknown as ReviewModel,
      buildUpdateTableRowQuery: buildUpdateTableRowQueryMock,
      getReviewQuery: 'SELECT * FROM Reviews WHERE id = ?',
    });

    await controller(req, res, mockNext);

    expect(buildUpdateTableRowQueryMock).toHaveBeenCalledWith(req.body, 'Review');
    expect(ReviewMock.update).toHaveBeenCalledWith({
      id: 1,
      query: 'UPDATE Reviews SET reviewText = ?, rating = ? WHERE id = ?',
      values: ['Updated review text', 4],
    });
    expect(ReviewMock.getOne).toHaveBeenCalledWith({ id: 1, query: 'SELECT * FROM Reviews WHERE id = ?' });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Review updated successfully',
      data: { id: 1, reviewText: 'Updated review text', rating: 4 },
    });
  });
});

describe('removeReviewController', () => {
  const ReviewMock = {
    remove: jest.fn(),
  };
  const req = {
    params: { id: '1' },
  } as unknown as Request;

  it('should remove a review', async () => {
    const res = mockResponse();

    const controller = removeReviewController({
      Review: ReviewMock as unknown as ReviewModel,
      buildRemoveQuery: (table: string) => `DELETE FROM ${table} WHERE id = ?`,
    });

    await controller(req, res, mockNext);

    expect(ReviewMock.remove).toHaveBeenCalledWith({ id: 1, query: 'DELETE FROM Review WHERE id = ?' });
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.NO_CONTENT_204);
    expect(res.end).toHaveBeenCalled();
  });
});
