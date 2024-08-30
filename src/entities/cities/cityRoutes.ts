import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getCitiesByRegionController } from './cityController';
import { getCitiesByRegionSchema } from './cityValidation';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { City } from './City';
import { getCitiesByRegionQuery } from './sqlQueries';

export const citiesRouter = express.Router();

const injectedGetCitiesByRegionController = getCitiesByRegionController({ City, query: getCitiesByRegionQuery });

citiesRouter
  .route('/cities')
  .get(validateReqQuery(getCitiesByRegionSchema), asyncErrorCatch(injectedGetCitiesByRegionController));
