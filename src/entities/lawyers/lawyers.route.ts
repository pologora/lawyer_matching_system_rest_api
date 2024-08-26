import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createLawyerController,
  getManyLawyersController,
  getLawyerController,
  removeLawyerController,
  updateLawyerController,
} from './lawyers.controller';
import { getManyLawyersQuerySchema, lawyerCreateSchema, lawyerUpdateSchema } from './lawyers.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { User } from '../users/users.model';
import { LawyersProfile } from './lawyers.model';
import { createLawyerService, updateLawyerService } from './lawyers.service';
import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { buildGetManyLawyersQuery } from './helpers/biuldGetManyLawyersQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import {
  createLawyerSpecializationsQuery,
  deleteLawyerQuery,
  deleteLawyerSpecializationsQuery,
  getLawyerByIdQuery,
} from './sqlQueries';

export const lawyersRouter = express.Router();

lawyersRouter.param('id', validateIdParameter);

const injectedCreateLawyerService = createLawyerService({
  LawyersProfile,
  User,
  buildCreateTableRowQuery,
  createLawyerSpecializationsQuery,
  getLawyerByIdQuery,
});
const injectedUpdateLawyerService = updateLawyerService({
  LawyersProfile,
  buildUpdateTableRowQuery,
  createLawyerSpecializationsQuery,
  deleteLawyerSpecializationsQuery,
  getLawyerByIdQuery,
});

const injectedCreateLawyerController = createLawyerController({ createLawyerService: injectedCreateLawyerService });
const injectedGetLawyerController = getLawyerController({ LawyersProfile, query: getLawyerByIdQuery });
const injectedGetManyLawyersController = getManyLawyersController({ LawyersProfile, buildGetManyLawyersQuery });
const injectedUpdateLawyerController = updateLawyerController({
  updateLawyerService: injectedUpdateLawyerService,
});
const injectedRemoveLawyerController = removeLawyerController({ LawyersProfile, query: deleteLawyerQuery });

lawyersRouter
  .route('/lawyers')
  .get(validateReqQuery(getManyLawyersQuerySchema), asyncErrorCatch(injectedGetManyLawyersController))
  .post(
    protect,
    restrictTo('user'),
    validateReqBody(lawyerCreateSchema),
    asyncErrorCatch(injectedCreateLawyerController),
  );
lawyersRouter
  .route('/lawyers/:id')
  .get(asyncErrorCatch(injectedGetLawyerController))
  .delete(protect, restrictTo('admin', 'lawyer'), asyncErrorCatch(injectedRemoveLawyerController))
  .patch(
    protect,
    restrictTo('admin', 'lawyer'),
    validateReqBody(lawyerUpdateSchema),
    asyncErrorCatch(injectedUpdateLawyerController),
  );
