import { Router } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { createReviewSchema, getManyReviewsSchema, updateReviewSchema } from './reviewValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { createReviewService } from './reviewService';
import { Lawyer } from '../lawyers/Lawyer';
import { ReviewController } from './ReviewController';
import { createControllerHandler } from '../../utils/createControllerHandler';

export const reviewsRouter = Router();

reviewsRouter.param('id', validateIdParameter);

const reviewController = new ReviewController({ Lawyer, createReviewService });

const createReviewHandler = createControllerHandler({ controller: reviewController });

const createOneHandler = createReviewHandler({ method: 'create' });
const getOneHandler = createReviewHandler({ method: 'getOne' });
const getManyHandler = createReviewHandler({ method: 'getMany' });
const updateHandler = createReviewHandler({ method: 'update' });
const removeHandler = createReviewHandler({ method: 'remove' });

reviewsRouter
  .route('/reviews')
  .get(validateReqQuery(getManyReviewsSchema), asyncErrorCatch(getManyHandler))
  .post(protect, restrictTo('client'), validateReqBody(createReviewSchema), asyncErrorCatch(createOneHandler));
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(getOneHandler))
  .patch(protect, restrictTo('client'), validateReqBody(updateReviewSchema), asyncErrorCatch(updateHandler))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeHandler));
