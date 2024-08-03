import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { validateId } from '../../utils/validateId';
import {
  createMessageService,
  getManyMessagesService,
  getMessageService,
  removeMessageService,
  updateMessageService,
} from './messages.service';

export const createMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const message = await createMessageService({ data: req.body });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created message',
    data: message,
  });
};

export const getMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const message = await getMessageService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Message retrieved successfully', data: message });
};

export const getManyMessagesController = async (req: Request, res: Response, _next: NextFunction) => {
  const messages = await getManyMessagesService({ queryString: req.query });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Messages retrieved successfully', data: messages });
};

export const updateMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const updatedMessage = await updateMessageService({ data: req.body, id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated message', data: updatedMessage });
};

export const removeMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  await removeMessageService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
