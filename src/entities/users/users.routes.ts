import { Router } from 'express';

import {
  createUserController,
  removeUserController,
  getManyUsersController,
  getUserController,
  updateUserController,
} from './users.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { verifyAndValidateRecordById } from '../../middleware/verifyAndValidateRecordById';
import { protect } from '../../middleware/protect';

export const usersRouter = Router();

usersRouter
  .route('/users')
  .get(protect, asyncErrorCatch(getManyUsersController))
  .post(asyncErrorCatch(createUserController));
usersRouter
  .route('/users/:id')
  .all(verifyAndValidateRecordById('users'))
  .get(asyncErrorCatch(getUserController))
  .delete(asyncErrorCatch(removeUserController))
  .patch(asyncErrorCatch(updateUserController));
