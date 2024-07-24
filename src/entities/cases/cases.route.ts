import express from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createCaseController,
  removeCaseController,
  getCaseController,
  updateCaseController,
  getManyCasesController,
} from './cases.controller';

export const casesRouter = express.Router();

casesRouter.route('/cases').get(asyncErrorCatch(getManyCasesController)).post(asyncErrorCatch(createCaseController));
casesRouter
  .route('/cases/:id')
  .get(asyncErrorCatch(getCaseController))
  .patch(asyncErrorCatch(updateCaseController))
  .delete(asyncErrorCatch(removeCaseController));
