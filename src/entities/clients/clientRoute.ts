import { Router } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { clientCreateSchema, clientUpdateSchema } from './clientValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { User } from '../users/User';
import { createClientService } from './clientService';
import { updateUserRoleQuery } from '../users/sqlQueries';
import { ClientController } from './ClientController';
import { createControllerHandler } from '../../utils/createControllerHandler';

export const clientsRouter = Router();

clientsRouter.param('id', validateIdParameter);

const clientController = new ClientController({ User, createClientService, updateUserRoleQuery });

const createClientHandler = createControllerHandler({ controller: clientController });

const createOneHandler = createClientHandler({ method: 'create' });
const getOneHandler = createClientHandler({ method: 'getOne' });
const getManyHandler = createClientHandler({ method: 'getMany' });
const updateHandler = createClientHandler({ method: 'update' });
const removeHandler = createClientHandler({ method: 'remove' });

clientsRouter
  .route('/clients')
  .get(protect, restrictTo('admin'), asyncErrorCatch(getManyHandler))
  .post(protect, restrictTo('user'), validateReqBody(clientCreateSchema), asyncErrorCatch(createOneHandler));

clientsRouter
  .route('/clients/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getOneHandler))
  .patch(protect, restrictTo('client'), validateReqBody(clientUpdateSchema), asyncErrorCatch(updateHandler))
  .delete(protect, restrictTo('admin', 'client'), asyncErrorCatch(removeHandler));
