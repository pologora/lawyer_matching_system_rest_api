import express from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createCaseController,
  removeCaseController,
  getCaseController,
  updateCaseController,
  getManyCasesController,
} from './cases.controller';
import { validateReqBody } from '../../middleware/validateReqBody';

import { createCaseSchema, getManyCasesSchema, updateCaseSchema } from './cases.validation';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { Case } from './cases.model';
import { buildCreateTableRowQuery } from '../../helpers/buildCreateTableRowQuery';
import { validateIdParameter } from '../../middleware/validateIdParameter';

export const casesRouter = express.Router();
casesRouter.param('id', validateIdParameter);

const injectedCreateCaseController = createCaseController(Case, buildCreateTableRowQuery);

casesRouter
  .route('/cases')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyCasesSchema),
    asyncErrorCatch(getManyCasesController),
  )
  .post(
    protect,
    restrictTo('client'),
    validateReqBody(createCaseSchema),
    asyncErrorCatch(injectedCreateCaseController),
  );

casesRouter
  .route('/cases/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getCaseController))
  .patch(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(updateCaseSchema),
    asyncErrorCatch(updateCaseController),
  )
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeCaseController));
