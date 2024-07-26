import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { getAllRegionsController } from './regions.controller';

export const regionsRouter = express.Router();

regionsRouter.route('/regions').get(asyncErrorCatch(getAllRegionsController));
