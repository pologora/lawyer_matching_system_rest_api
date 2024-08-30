import express from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { validateReqBody } from '../../middleware/validateReqBody';

import { createCaseSchema, getManyCasesSchema, updateCaseSchema } from './caseValidation';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { CaseController } from './CaseController';
import { createControllerHandler } from '../../utils/createControllerHandler';

export const casesRouter = express.Router();
casesRouter.param('id', validateIdParameter);

const caseController = new CaseController();

const createCaseHandler = createControllerHandler({ controller: caseController });

const createOneHandler = createCaseHandler({ method: 'create' });
const getOneHandler = createCaseHandler({ method: 'getOne' });
const getManyHandler = createCaseHandler({ method: 'getMany' });
const updateHandler = createCaseHandler({ method: 'update' });
const removeHandler = createCaseHandler({ method: 'remove' });

casesRouter
  .route('/cases')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyCasesSchema),
    asyncErrorCatch(getManyHandler),
  )
  .post(protect, restrictTo('client'), validateReqBody(createCaseSchema), asyncErrorCatch(createOneHandler));

casesRouter
  .route('/cases/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getOneHandler))
  .patch(protect, restrictTo('client', 'lawyer'), validateReqBody(updateCaseSchema), asyncErrorCatch(updateHandler))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeHandler));
