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
import { buildInsertQuery } from '../../utils/buildInsertQuery';
import { LawyersProfile } from '../lawyers/lawyers.model';
import { Review } from './reviews.model';
import { buildGetManyReviewsQuery } from './helpers/buildGetManyReviewsQuery';
import { buildUpdateQuery } from '../../utils/buildUpdateQuery';
import { getReviewQuery } from './sqlQueries';
import { buildRemoveQuery } from '../../utils/buildDeleteQuery';

export const reviewsRouter = express.Router();

reviewsRouter.param('id', validateIdParameter);

const injectedCreateReviewService = createReviewService({
  LawyersProfile,
  Review,
  buildCreateTableRowQuery: buildInsertQuery,
  getReviewQuery,
});

const injectedCreateReviewController = createReviewController({ createReviewService: injectedCreateReviewService });
const injectedGetReviewController = getReviewController({ Review, query: getReviewQuery });
const injectedGetManyReviewsController = getManyReviewsController({ Review, buildGetManyReviewsQuery });
const injectedUpdateReviewController = updateReviewController({
  Review,
  buildUpdateTableRowQuery: buildUpdateQuery,
  getReviewQuery,
});
const injectedRemoveReviewController = removeReviewController({ Review, buildRemoveQuery });

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
