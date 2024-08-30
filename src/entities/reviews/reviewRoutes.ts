import express, { NextFunction, Request, Response } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { createReviewSchema, getManyReviewsSchema, updateReviewSchema } from './reviewValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { createReviewService } from './reviewService';
import { LawyersProfile } from '../lawyers/lawyers.model';
import { ReviewController } from './ReviewController';

export const reviewsRouter = express.Router();

reviewsRouter.param('id', validateIdParameter);

const reviewController = new ReviewController({ LawyersProfile, createReviewService });
const createOneHandler = (req: Request, res: Response, next: NextFunction) => reviewController.create(req, res, next);
const getOneHandler = (req: Request, res: Response, next: NextFunction) => reviewController.getOne(req, res, next);
const getManyHandler = (req: Request, res: Response, next: NextFunction) => reviewController.getMany(req, res, next);
const updateHandler = (req: Request, res: Response, next: NextFunction) => reviewController.update(req, res, next);
const removeHandler = (req: Request, res: Response, next: NextFunction) => reviewController.remove(req, res, next);

reviewsRouter
  .route('/reviews')
  .get(validateReqQuery(getManyReviewsSchema), asyncErrorCatch(getManyHandler))
  .post(protect, restrictTo('client'), validateReqBody(createReviewSchema), asyncErrorCatch(createOneHandler));
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(getOneHandler))
  .patch(protect, restrictTo('client'), validateReqBody(updateReviewSchema), asyncErrorCatch(updateHandler))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeHandler));
