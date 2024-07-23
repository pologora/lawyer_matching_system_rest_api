import express from 'express';
import {
  createClientController,
  getClientController,
  getManyClientsController,
  removeClientController,
  updateClientController,
} from './clients.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';

export const clientsRouter = express.Router();

clientsRouter
  .route('/clients')
  .get(asyncErrorCatch(getManyClientsController))
  .post(asyncErrorCatch(createClientController));
clientsRouter
  .route('/clients/:id')
  .get(asyncErrorCatch(getClientController))
  .patch(asyncErrorCatch(updateClientController))
  .delete(asyncErrorCatch(removeClientController));
