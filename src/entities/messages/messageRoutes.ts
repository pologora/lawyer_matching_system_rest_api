import express, { NextFunction, Request, Response } from 'express';

import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { createMessageSchema, getManyMessagesSchema, updateMessageSchema } from './messageValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import { validateReqQuery } from '../../middleware/validateReqQuery';
import { protect } from '../../middleware/protect';
import { restrictTo } from '../../middleware/restrictTo';
import { validateIdParameter } from '../../middleware/validateIdParameter';
import { MessageController } from './MessageController';

export const messagesRoute = express.Router();

messagesRoute.param('id', validateIdParameter);

const messageController = new MessageController();
const createOneHandler = (req: Request, res: Response, next: NextFunction) => messageController.create(req, res, next);
const getOneHandler = (req: Request, res: Response, next: NextFunction) => messageController.getOne(req, res, next);
const getManyHandler = (req: Request, res: Response, next: NextFunction) => messageController.getMany(req, res, next);
const updateHandler = (req: Request, res: Response, next: NextFunction) => messageController.update(req, res, next);
const removeHandler = (req: Request, res: Response, next: NextFunction) => messageController.remove(req, res, next);

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
