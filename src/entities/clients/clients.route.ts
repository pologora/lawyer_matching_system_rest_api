import express from 'express';
import {
  createClientController,
  getClientController,
  getManyClientsController,
  removeClientController,
  updateClientController,
} from './clients.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { clientCreateSchema, clientUpdateSchema } from './clients.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';

export const clientsRouter = express.Router();

clientsRouter.param('id', validateIdParameter);

clientsRouter
  .route('/clients')
  .get(protect, restrictTo('admin'), asyncErrorCatch(getManyClientsController))
  .post(protect, restrictTo('user'), validateReqBody(clientCreateSchema), asyncErrorCatch(createClientController));
clientsRouter
  .route('/clients/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getClientController))
  .patch(protect, restrictTo('client'), validateReqBody(clientUpdateSchema), asyncErrorCatch(updateClientController))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeClientController));
