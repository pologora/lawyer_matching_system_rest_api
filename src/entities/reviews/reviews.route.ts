import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createReviewController,
  getManyReviewsController,
  getReviewController,
  removeReviewController,
  updateReviewController,
} from './reviews.controller';
import { createReviewSchema, getManyReviewsShema, updateReviewSchema } from './reviews.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';

export const reviewsRouter = express.Router();

reviewsRouter
  .route('/reviews')
  .get(validateReqQuery(getManyReviewsShema), asyncErrorCatch(getManyReviewsController))
  .post(validateReqBody(createReviewSchema), asyncErrorCatch(createReviewController));
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(getReviewController))
  .patch(validateReqBody(updateReviewSchema), asyncErrorCatch(updateReviewController))
  .delete(asyncErrorCatch(removeReviewController));
