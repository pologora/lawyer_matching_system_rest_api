import { Router } from 'express';

import { create, remove, getAll, get, update } from './users.controller';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { verifyAndValidateRecordById } from '../../middleware/verifyAndValidateRecordById';

export const usersRouter = Router();

usersRouter.route('/users').get(asyncErrorCatch(getAll)).post(asyncErrorCatch(create));
usersRouter
  .route('/users/:id')
  .all(verifyAndValidateRecordById('users'))
  .get(asyncErrorCatch(get))
  .delete(asyncErrorCatch(remove))
  .patch(asyncErrorCatch(update));
