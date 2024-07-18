import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createLawyerController,
  getManyLawyersController,
  getLawyerController,
  removeLawyerController,
  updateLawyerController,
} from './lawyers.controller';

export const lawyersRouter = express.Router();

lawyersRouter
  .route('/lawyers')
  .get(asyncErrorCatch(getManyLawyersController))
  .post(asyncErrorCatch(createLawyerController));
lawyersRouter
  .route('/lawyers/:id')
  .get(asyncErrorCatch(getLawyerController))
  .delete(asyncErrorCatch(removeLawyerController))
  .patch(asyncErrorCatch(updateLawyerController));
