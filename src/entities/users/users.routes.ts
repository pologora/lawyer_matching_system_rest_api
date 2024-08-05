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
import { getManyUsersSchema, userCreateSchema, userUpdateSchema } from './users.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { restrictTo } from '../../middleware/restrictTo';

export const usersRouter = Router();

usersRouter
  .route('/users')
  .get(protect, restrictTo('admin'), validateReqQuery(getManyUsersSchema), asyncErrorCatch(getManyUsersController))
  .post(protect, restrictTo('admin'), validateReqBody(userCreateSchema), asyncErrorCatch(createUserController));
usersRouter
  .route('/users/:id')
  .get(protect, restrictTo('admin'), asyncErrorCatch(getUserController))
  .delete(protect, restrictTo('admin'), asyncErrorCatch(removeUserController))
  .patch(protect, restrictTo('admin'), validateReqBody(userUpdateSchema), asyncErrorCatch(updateUserController));
usersRouter
  .route('/users/:id/upload-photo')
  .patch(protect, uploadPhoto(), resizeUserPhoto, asyncErrorCatch(uploadUserPhotoController));
