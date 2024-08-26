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
import { User } from '../users/users.model';
import { ClientProfile } from './clients.model';
import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';

export const clientsRouter = express.Router();

clientsRouter.param('id', validateIdParameter);

const injectedCreateClientController = createClientController({
  ClientProfile,
  User,
  buildCreateTableRowQuery,
});
const injectedGetClientController = getClientController({ ClientProfile });
const injectedGetManyClientsController = getManyClientsController({ ClientProfile });
const injectedUpdateClientController = updateClientController({
  ClientProfile,
  buildUpdateTableRowQuery,
});
const injectedremoveClientController = removeClientController({ ClientProfile });

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
