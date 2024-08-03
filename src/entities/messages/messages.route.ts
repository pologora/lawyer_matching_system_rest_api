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

export const messagesRoute = express.Router();

messagesRoute
  .route('/messages')
  .get(validateReqQuery(getManyMessagesSchema), asyncErrorCatch(getManyMessagesController))
  .post(validateReqBody(createMessageSchema), asyncErrorCatch(createMessageController));
messagesRoute
  .route('/messages/:id')
  .get(asyncErrorCatch(getMessageController))
  .patch(validateReqBody(updateMessageSchema), asyncErrorCatch(updateMessageController))
  .delete(asyncErrorCatch(removeMessageController));
