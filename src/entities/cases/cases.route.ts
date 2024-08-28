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
import { buildInsertQuery } from '../../utils/buildInsertQuery';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { buildGetManyCasesQuery } from './helpers/buildGetManyCasesQuery';
import { buildUpdateQuery } from '../../utils/buildUpdateQuery';
import { getOneCaseQuery } from './sqlQueries';
import { buildRemoveQuery } from '../../utils/buildDeleteQuery';

export const casesRouter = express.Router();
casesRouter.param('id', validateIdParameter);

const injectedCreateCaseController = createCaseController({
  Case,
  buildCreateTableRowQuery: buildInsertQuery,
  getOneCaseQuery,
});
const injectedGetManyCasesController = getManyCasesController({ Case, buildGetManyCasesQuery });
const injectedGetCaseController = getCaseController({ Case, query: getOneCaseQuery });
const injectedUpdateCaseController = updateCaseController({
  Case,
  buildUpdateTableRowQuery: buildUpdateQuery,
  getOneCaseQuery,
});
const injectedRemoveCaseController = removeCaseController({ Case, buildRemoveQuery });

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
