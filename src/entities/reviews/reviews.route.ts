import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createReviewController,
  getManyReviewsController,
  getReviewController,
  removeReviewController,
  updateReviewController,
} from './reviews.controller';
import { createReviewSchema, getManyReviewsSchema, updateReviewSchema } from './reviews.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';

export const reviewsRouter = express.Router();

reviewsRouter
  .route('/reviews')
  .get(validateReqQuery(getManyReviewsSchema), asyncErrorCatch(getManyReviewsController))
  .post(protect, restrictTo('client'), validateReqBody(createReviewSchema), asyncErrorCatch(createReviewController));
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(getReviewController))
  .patch(protect, restrictTo('client'), validateReqBody(updateReviewSchema), asyncErrorCatch(updateReviewController))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeReviewController));
