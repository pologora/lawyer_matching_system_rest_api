import { Router } from 'express';

import {
  createUserController,
  removeUserController,
  getManyUsersController,
  getUserController,
  updateUserController,
} from './users.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';

export const usersRouter = Router();

usersRouter.route('/users').get(asyncErrorCatch(getManyUsersController)).post(asyncErrorCatch(createUserController));
usersRouter
  .route('/users/:id')
  .get(asyncErrorCatch(getUserController))
  .delete(asyncErrorCatch(removeUserController))
  .patch(asyncErrorCatch(updateUserController));
