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

export const casesRouter = express.Router();

casesRouter
  .route('/cases')
  .get(validateReqQuery(getManyCasesSchema), asyncErrorCatch(getManyCasesController))
  .post(validateReqBody(createCaseSchema), asyncErrorCatch(createCaseController));
casesRouter
  .route('/cases/:id')
  .get(asyncErrorCatch(getCaseController))
  .patch(validateReqBody(updateCaseSchema), asyncErrorCatch(updateCaseController))
  .delete(asyncErrorCatch(removeCaseController));
