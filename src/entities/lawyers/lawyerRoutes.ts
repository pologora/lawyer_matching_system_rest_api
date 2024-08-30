import express from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getManyLawyersQuerySchema, lawyerCreateSchema, lawyerUpdateSchema } from './lawyerValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { User } from '../users/User';
import { createLawyerService, updateLawyerService } from './lawyerService';
import { createLawyerSpecializationsQuery, deleteLawyerSpecializationsQuery } from './sqlQueries';
import { updateUserRoleQuery } from '../users/sqlQueries';
import { LawyerController } from './LawyerController';
import { createControllerHandler } from '../../utils/createControllerHandler';

export const lawyersRouter = express.Router();
lawyersRouter.param('id', validateIdParameter);

const lawyerController = new LawyerController({
  User,
  createLawyerService,
  createLawyerSpecializationsQuery,
  deleteLawyerSpecializationsQuery,
  updateLawyerService,
  updateUserRoleQuery,
});

const createLawyerHandler = createControllerHandler({ controller: lawyerController });

const createOneHandler = createLawyerHandler({ method: 'create' });
const getOneHandler = createLawyerHandler({ method: 'getOne' });
const getManyHandler = createLawyerHandler({ method: 'getMany' });
const updateHandler = createLawyerHandler({ method: 'update' });
const removeHandler = createLawyerHandler({ method: 'remove' });

lawyersRouter
  .route('/lawyers')
  .get(validateReqQuery(getManyLawyersQuerySchema), asyncErrorCatch(getManyHandler))
  .post(protect, restrictTo('user'), validateReqBody(lawyerCreateSchema), asyncErrorCatch(createOneHandler));
lawyersRouter
  .route('/lawyers/:id')
  .get(asyncErrorCatch(getOneHandler))
  .delete(protect, restrictTo('admin', 'lawyer'), asyncErrorCatch(removeHandler))
  .patch(protect, restrictTo('admin', 'lawyer'), validateReqBody(lawyerUpdateSchema), asyncErrorCatch(updateHandler));
