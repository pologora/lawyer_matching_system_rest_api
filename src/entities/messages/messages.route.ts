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
import { Message } from './messages.model';
import { buildCreateTableRowQuery } from '../../utils/buildCreateTableRowQuery';
import { getMessageQuery, removeMessageQuery } from './sqlQueries';
import { buildGetManyMessagesQuery } from './helpers/buildGetManyMessagesQuery';
import { buildUpdateTableRowQuery } from '../../utils/buildUpdateTableRowQuery';

export const messagesRoute = express.Router();

messagesRoute.param('id', validateIdParameter);

const injectedCreateMessageController = createMessageController({ Message, buildCreateTableRowQuery, getMessageQuery });
const injectedGetMessageController = getMessageController({ Message, query: getMessageQuery });
const injectedGetManyMessagesController = getManyMessagesController({ Message, buildGetManyMessagesQuery });
const injectedUpdateMessageController = updateMessageController({ Message, buildUpdateTableRowQuery, getMessageQuery });
const injectedRemoveMessageController = removeMessageController({ Message, query: removeMessageQuery });

messagesRoute
  .route('/messages')
  .get(
    protect,
    restrictTo('admin', 'client', 'lawyer'),
    validateReqQuery(getManyMessagesSchema),
    asyncErrorCatch(injectedGetManyMessagesController),
  )
  .post(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(createMessageSchema),
    asyncErrorCatch(injectedCreateMessageController),
  );

messagesRoute
  .route('/messages/:id')
  .get(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(injectedGetMessageController))
  .patch(
    protect,
    restrictTo('client', 'lawyer'),
    validateReqBody(updateMessageSchema),
    asyncErrorCatch(injectedUpdateMessageController),
  )
  .delete(protect, restrictTo('admin', 'client', 'lawyer'), asyncErrorCatch(injectedRemoveMessageController));
