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
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { User } from './users.model';
import { buildGetManyUsersQuery } from './helpers/buildGetManyUsersQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import { createUserQuery, deleteUserQuery, getUserByIdQuery } from './sqlQueries';

export const usersRouter = Router();

usersRouter.param('id', validateIdParameter);

const injectedCreateUserController = createUserController({ User, hashPassword, query: createUserQuery });
const injectetGetUserController = getUserController({ User, query: getUserByIdQuery });
const injectetGetManyUsersController = getManyUsersController({ User, buildGetManyUsersQuery });
const injectetUpdateUserController = updateUserController({ User, buildUpdateTableRowQuery, getUserByIdQuery });
const injectetRemoveUserController = removeUserController({ User, query: deleteUserQuery });
const injectetUploadPhotoUserController = uploadUserPhotoController({
  User,
  buildUpdateTableRowQuery,
});

usersRouter
  .route('/users')
  .get(
    protect,
    restrictTo('admin'),
    validateReqQuery(getManyUsersSchema),
    asyncErrorCatch(injectetGetManyUsersController),
  )
  .post(protect, restrictTo('admin'), validateReqBody(userCreateSchema), asyncErrorCatch(injectedCreateUserController));
usersRouter
  .route('/users/:id')
  .get(protect, restrictTo('admin'), asyncErrorCatch(injectetGetUserController))
  .delete(protect, restrictTo('admin'), asyncErrorCatch(injectetRemoveUserController))
  .patch(
    protect,
    restrictTo('admin'),
    validateReqBody(userUpdateSchema),
    asyncErrorCatch(injectetUpdateUserController),
  );
usersRouter
  .route('/users/:id/upload-photo')
  .patch(protect, uploadPhoto(), resizeUserPhoto, asyncErrorCatch(injectetUploadPhotoUserController));
