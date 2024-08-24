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
import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { buildGetManyCasesQuery } from './helpers/buildGetManyCasesQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';
import { checkDatabaseOperation } from '../../utils/checkDatabaseOperationResult';

export const casesRouter = express.Router();
casesRouter.param('id', validateIdParameter);

const injectedCreateCaseController = createCaseController({ Case, buildCreateTableRowQuery, checkDatabaseOperation });
const injectedGetManyCasesController = getManyCasesController({ Case, buildGetManyCasesQuery, checkDatabaseOperation });
const injectedGetCaseController = getCaseController({ Case, checkDatabaseOperation });
const injectedUpdateCaseController = updateCaseController({ Case, buildUpdateTableRowQuery, checkDatabaseOperation });
const injectedRemoveCaseController = removeCaseController({ Case, checkDatabaseOperation });

casesRouter
  .route('/cases')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyCasesSchema),
    asyncErrorCatch(injectedGetManyCasesController),
  )
  .post(
    protect,
    restrictTo('client'),
    validateReqBody(createCaseSchema),
    asyncErrorCatch(injectedCreateCaseController),
  );

casesRouter
  .route('/cases/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(injectedGetCaseController))
  .patch(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(updateCaseSchema),
    asyncErrorCatch(injectedUpdateCaseController),
  )
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(injectedRemoveCaseController));
