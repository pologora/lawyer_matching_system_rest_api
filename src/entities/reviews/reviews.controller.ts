import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { AppError } from '../../utils/errors/AppError';
import { validateId } from '../../utils/validateId';
import { createReviewSchema, getManyReviewsShema, updateReviewSchema } from './reviews.validation';
import {
  createReviewService,
  getManyReviewsService,
  getReviewService,
  removeReviewService,
  updateReviewService,
} from './reviews.service';

export const createReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = createReviewSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const review = await createReviewService({ data: value });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created review',
    data: review,
  });
};

export const getReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const review = await getReviewService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Review retrieved successfully', data: review });
};

export const getManyReviewsController = async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req;

  const { error, value } = getManyReviewsShema.validate(query);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const reviews = await getManyReviewsService({ queryString: value });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Reviews retrieved successfully', data: reviews });
};

export const updateReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = updateReviewSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedReview = await updateReviewService({ data: value, id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated review', data: updatedReview });
};

export const removeReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeReviewService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
