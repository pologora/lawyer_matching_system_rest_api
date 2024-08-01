import { Router } from 'express';

import {
  createUserController,
  removeUserController,
  getManyUsersController,
  getUserController,
  updateUserController,
  uploadUserPhotoController,
} from './users.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { uploadPhoto } from '../../middleware/uploadPhoto';
import { protect } from '../../middleware/protect';
import { resizeUserPhoto } from '../../middleware/resizeUserPhoto';

export const usersRouter = Router();

usersRouter.route('/users').get(asyncErrorCatch(getManyUsersController)).post(asyncErrorCatch(createUserController));
usersRouter
  .route('/users/:id')
  .get(asyncErrorCatch(getUserController))
  .delete(asyncErrorCatch(removeUserController))
  .patch(asyncErrorCatch(updateUserController));
usersRouter
  .route('/users/:id/upload-photo')
  .patch(protect, uploadPhoto(), resizeUserPhoto, asyncErrorCatch(uploadUserPhotoController));
