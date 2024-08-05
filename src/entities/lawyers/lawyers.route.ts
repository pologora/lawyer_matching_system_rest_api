import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createLawyerController,
  getManyLawyersController,
  getLawyerController,
  removeLawyerController,
  updateLawyerController,
} from './lawyers.controller';
import { getManyLawyersQuerySchema, lawyerCreateSchema, lawyerUpdateSchema } from './lawyers.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';

export const lawyersRouter = express.Router();

lawyersRouter
  .route('/lawyers')
  .get(validateReqQuery(getManyLawyersQuerySchema), asyncErrorCatch(getManyLawyersController))
  .post(protect, restrictTo('user'), validateReqBody(lawyerCreateSchema), asyncErrorCatch(createLawyerController));
lawyersRouter
  .route('/lawyers/:id')
  .get(asyncErrorCatch(getLawyerController))
  .delete(protect, restrictTo('admin', 'lawyer'), asyncErrorCatch(removeLawyerController))
  .patch(
    protect,
    restrictTo('admin', 'lawyer'),
    validateReqBody(lawyerUpdateSchema),
    asyncErrorCatch(updateLawyerController),
  );
