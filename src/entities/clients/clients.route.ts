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

export const clientsRouter = express.Router();

clientsRouter
  .route('/clients')
  .get(asyncErrorCatch(getManyClientsController))
  .post(validateReqBody(clientCreateSchema), asyncErrorCatch(createClientController));
clientsRouter
  .route('/clients/:id')
  .get(asyncErrorCatch(getClientController))
  .patch(validateReqBody(clientUpdateSchema), asyncErrorCatch(updateClientController))
  .delete(asyncErrorCatch(removeClientController));
