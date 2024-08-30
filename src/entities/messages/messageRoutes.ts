import { Router } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { createMessageSchema, getManyMessagesSchema, updateMessageSchema } from './messageValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { MessageController } from './MessageController';
import { createControllerHandler } from '../../utils/createControllerHandler';

export const messagesRoute = Router();

messagesRoute.param('id', validateIdParameter);

const messageController = new MessageController();

const createMessageHandler = createControllerHandler({ controller: messageController });

const createOneHandler = createMessageHandler({ method: 'create' });
const getOneHandler = createMessageHandler({ method: 'getOne' });
const getManyHandler = createMessageHandler({ method: 'getMany' });
const updateHandler = createMessageHandler({ method: 'update' });
const removeHandler = createMessageHandler({ method: 'remove' });

messagesRoute
  .route('/messages')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyMessagesSchema),
    asyncErrorCatch(getManyHandler),
  )
  .post(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(createMessageSchema),
    asyncErrorCatch(createOneHandler),
  );

messagesRoute
  .route('/messages/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getOneHandler))
  .patch(protect, restrictTo('client', 'lawyer'), validateReqBody(updateMessageSchema), asyncErrorCatch(updateHandler))
  .delete(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(removeHandler));
