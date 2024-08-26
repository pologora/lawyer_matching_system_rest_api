import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getCitiesByRegionController } from './cities.controller';
import { getCitiesByRegionSchema } from './cities.validation';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { City } from './cities.model';

export const citiesRouter = express.Router();

const injectedGetCitiesByRegionController = getCitiesByRegionController({ City });

citiesRouter
  .route('/cities')
  .get(validateReqQuery(getCitiesByRegionSchema), asyncErrorCatch(injectedGetCitiesByRegionController));
