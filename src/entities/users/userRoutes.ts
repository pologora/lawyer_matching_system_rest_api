import { NextFunction, Request, Response, Router } from 'express';

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

export const usersRouter = Router();

usersRouter.param('id', validateIdParameter);

const userController = new UserController({ hashPassword });
const createOneHandler = (req: Request, res: Response, next: NextFunction) => userController.create(req, res, next);
const getOneHandler = (req: Request, res: Response, next: NextFunction) => userController.getOne(req, res, next);
const getManyHandler = (req: Request, res: Response, next: NextFunction) => userController.getMany(req, res, next);
const updateHandler = (req: Request, res: Response, next: NextFunction) => userController.update(req, res, next);
const removeHandler = (req: Request, res: Response, next: NextFunction) => userController.remove(req, res, next);
const uploadPhotoHandler = (req: Request, res: Response, next: NextFunction) =>
  userController.uploadPhoto(req, res, next);

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
  .patch(protect, uploadPhoto(), resizeUserPhoto, asyncErrorCatch(uploadPhotoHandler));
