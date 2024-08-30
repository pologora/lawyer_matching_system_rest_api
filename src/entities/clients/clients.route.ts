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
import { User } from '../users/User';
import { ClientProfile } from './clients.model';
import { buildInsertQuery } from '../../utils/buildInsertQuery';
import { buildUpdateQuery } from '../../utils/buildUpdateQuery';
import { deleteClientQuery, getManyClientsQuery, getOneClientQuery } from './slqQueries';
import { createClientService } from './clients.service';
import { updateUserRoleQuery } from '../users/sqlQueries';

export const clientsRouter = express.Router();

clientsRouter.param('id', validateIdParameter);

const injectedCreateClientService = createClientService({
  ClientProfile,
  User,
  buildCreateTableRowQuery: buildInsertQuery,
  getOneClientQuery,
  updateUserRoleQuery,
});

const injectedCreateClientController = createClientController({ createClientService: injectedCreateClientService });
const injectedGetClientController = getClientController({ ClientProfile, query: getOneClientQuery });
const injectedGetManyClientsController = getManyClientsController({ ClientProfile, query: getManyClientsQuery });
const injectedUpdateClientController = updateClientController({
  ClientProfile,
  buildUpdateTableRowQuery: buildUpdateQuery,
  getOneClientQuery,
});
const injectedremoveClientController = removeClientController({ ClientProfile, query: deleteClientQuery });

clientsRouter
  .route('/clients')
  .get(protect, restrictTo('admin'), asyncErrorCatch(injectedGetManyClientsController))
  .post(
    protect,
    restrictTo('user'),
    validateReqBody(clientCreateSchema),
    asyncErrorCatch(injectedCreateClientController),
  );

clientsRouter
  .route('/clients/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(injectedGetClientController))
  .patch(
    protect,
    restrictTo('client'),
    validateReqBody(clientUpdateSchema),
    asyncErrorCatch(injectedUpdateClientController),
  )
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(injectedremoveClientController));
