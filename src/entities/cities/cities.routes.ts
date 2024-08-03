import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getCitiesByRegionController } from './cities.controller';
import { getCitiesByRegionSchema } from './cities.validation';
import { validateReqQuery } from '../../middleware/validateReqQuery';

export const citiesRouter = express.Router();

citiesRouter
  .route('/cities')
  .get(validateReqQuery(getCitiesByRegionSchema), asyncErrorCatch(getCitiesByRegionController));
