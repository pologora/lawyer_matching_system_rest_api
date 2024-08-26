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
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { createReviewService } from './reviews.service';
import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { LawyersProfile } from '../lawyers/lawyers.model';
import { Review } from './reviews.model';
import { buildGetManyReviewsQuery } from './helpers/buildGetManyReviewsQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import { getReviewQuery, removeReviewQuery } from './sqlQueries';

export const reviewsRouter = express.Router();

reviewsRouter.param('id', validateIdParameter);

const injectedCreateReviewService = createReviewService({
  LawyersProfile,
  Review,
  buildCreateTableRowQuery,
  getReviewQuery,
});

const injectedCreateReviewController = createReviewController({ createReviewService: injectedCreateReviewService });
const injectedGetReviewController = getReviewController({ Review, query: getReviewQuery });
const injectedGetManyReviewsController = getManyReviewsController({ Review, buildGetManyReviewsQuery });
const injectedUpdateReviewController = updateReviewController({ Review, buildUpdateTableRowQuery, getReviewQuery });
const injectedRemoveReviewController = removeReviewController({ Review, query: removeReviewQuery });

reviewsRouter
  .route('/reviews')
  .get(validateReqQuery(getManyReviewsSchema), asyncErrorCatch(injectedGetManyReviewsController))
  .post(
    protect,
    restrictTo('client'),
    validateReqBody(createReviewSchema),
    asyncErrorCatch(injectedCreateReviewController),
  );
reviewsRouter
  .route('/reviews/:id')
  .get(asyncErrorCatch(injectedGetReviewController))
  .patch(
    protect,
    restrictTo('client'),
    validateReqBody(updateReviewSchema),
    asyncErrorCatch(injectedUpdateReviewController),
  )
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(injectedRemoveReviewController));
