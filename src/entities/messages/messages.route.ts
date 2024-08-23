import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createMessageController,
  getManyMessagesController,
  getMessageController,
  removeMessageController,
  updateMessageController,
} from './messages.controller';
import { createMessageSchema, getManyMessagesSchema, updateMessageSchema } from './messages.validation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';

export const messagesRoute = express.Router();

messagesRoute.param('id', validateIdParameter);

messagesRoute
  .route('/messages')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyMessagesSchema),
    asyncErrorCatch(getManyMessagesController),
  )
  .post(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(createMessageSchema),
    asyncErrorCatch(createMessageController),
  );

messagesRoute
  .route('/messages/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(getMessageController))
  .patch(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(updateMessageSchema),
    asyncErrorCatch(updateMessageController),
  )
  .delete(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(removeMessageController));
