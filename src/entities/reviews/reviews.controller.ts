import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createReviewService,
  getManyReviewsService,
  getReviewService,
  removeReviewService,
  updateReviewService,
} from './reviews.service';

export const createReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const review = await createReviewService({ data: req.body });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created new review',
    data: review,
  });
};

export const getReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const review = await getReviewService({ id: Number(req.params.id) });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Review retrieved successfully', data: review });
};

export const getManyReviewsController = async (req: Request, res: Response, _next: NextFunction) => {
  const reviews = await getManyReviewsService({ queryString: req.query });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Reviews retrieved successfully', data: reviews });
};

export const updateReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  const updatedReview = await updateReviewService({ data: req.body, id: Number(req.params.id) });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Review updated successfully', data: updatedReview });
};

export const removeReviewController = async (req: Request, res: Response, _next: NextFunction) => {
  await removeReviewService({ id: Number(req.params.id) });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
