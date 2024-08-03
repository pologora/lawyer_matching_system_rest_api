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

export const lawyersRouter = express.Router();

lawyersRouter
  .route('/lawyers')
  .get(validateReqQuery(getManyLawyersQuerySchema), asyncErrorCatch(getManyLawyersController))
  .post(validateReqBody(lawyerCreateSchema), asyncErrorCatch(createLawyerController));
lawyersRouter
  .route('/lawyers/:id')
  .get(asyncErrorCatch(getLawyerController))
  .delete(asyncErrorCatch(removeLawyerController))
  .patch(validateReqBody(lawyerUpdateSchema), asyncErrorCatch(updateLawyerController));
