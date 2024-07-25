import express from 'express';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import {
  createMessageController,
  getManyMessagesController,
  getMessageController,
  removeMessageController,
  updateMessageController,
} from './messages.controller';

export const messagesRoute = express.Router();

messagesRoute
  .route('/messages')
  .get(asyncErrorCatch(getManyMessagesController))
  .post(asyncErrorCatch(createMessageController));
messagesRoute
  .route('/messages/:id')
  .get(asyncErrorCatch(getMessageController))
  .patch(asyncErrorCatch(updateMessageController))
  .delete(asyncErrorCatch(removeMessageController));
