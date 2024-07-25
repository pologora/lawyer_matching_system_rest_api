import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createReviewController,
  getManyReviewsController,
  getReviewController,
  removeReviewController,
  updateReviewController,
} from './reviews.controller';

export const reviewsRouter = express.Router();

reviewsRouter
  .route('/reviews')
  .get(asyncErrorCatch(getManyReviewsController))
  .post(asyncErrorCatch(createReviewController));
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(getReviewController))
  .patch(asyncErrorCatch(updateReviewController))
  .delete(asyncErrorCatch(removeReviewController));
