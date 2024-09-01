import { Router } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { uploadPhoto } from '../../middleware/uploadPhoto';
import { protect } from '../../middleware/protect';
import { resizeUserPhoto } from '../../middleware/resizeUserPhoto';
import { getManyUsersSchema, userCreateSchema, userUpdateSchema } from './userValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { hashPassword } from '../../utils/passwordManagement/hashPassword';
import { UserController } from './UserController';
import { createControllerHandler } from '../../utils/createControllerHandler';
import { buildGetManyUsersQuery } from './helpers/buildGetManyUsersQuery';
import { getUserByIdQuery } from './sqlQueries';
import { User } from './User';

export const usersRouter = Router();

usersRouter.param('id', validateIdParameter);
const userController = new UserController({
  User,
  buildGetManyUsersQuery,
  getUserByIdQuery,
  hashPassword,
});

const createUserHandler = createControllerHandler({ controller: userController });

const createOneHandler = createUserHandler({ method: 'create' });
const getOneHandler = createUserHandler({ method: 'getOne' });
const getManyHandler = createUserHandler({ method: 'getMany' });
const updateHandler = createUserHandler({ method: 'update' });
const removeHandler = createUserHandler({ method: 'remove' });
const uploadPhotoHandler = createUserHandler({ method: 'uploadPhoto' });

usersRouter
  .route('/users')
  .get(protect, restrictTo('admin'), validateReqQuery(getManyUsersSchema), asyncErrorCatch(getManyHandler))
  .post(protect, restrictTo('admin'), validateReqBody(userCreateSchema), asyncErrorCatch(createOneHandler));
usersRouter
  .route('/users/:id')
  .get(protect, restrictTo('admin'), asyncErrorCatch(getOneHandler))
  .delete(protect, restrictTo('admin'), asyncErrorCatch(removeHandler))
  .patch(protect, restrictTo('admin'), validateReqBody(userUpdateSchema), asyncErrorCatch(updateHandler));
usersRouter
  .route('/users/:id/upload-photo')
  .patch(protect, uploadPhoto(), asyncErrorCatch(resizeUserPhoto), asyncErrorCatch(uploadPhotoHandler));
