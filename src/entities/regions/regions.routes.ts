import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getAllRegionsController } from './regions.controller';
import { Region } from './regions.model';
import { getAllRegionsQuery } from './sqlQueries';

export const regionsRouter = express.Router();

const injectedGetAllRegionsController = getAllRegionsController({ Region, query: getAllRegionsQuery });

regionsRouter.route('/regions').get(asyncErrorCatch(injectedGetAllRegionsController));
