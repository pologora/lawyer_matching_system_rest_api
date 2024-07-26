import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getCitiesByRegionController } from './cities.controller';

export const citiesRouter = express.Router();

citiesRouter.route('/cities').get(asyncErrorCatch(getCitiesByRegionController));
