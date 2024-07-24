import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { AppError } from '../../utils/errors/AppError';
import { validateId } from '../../utils/validateId';
import {
  createMessageService,
  getManyMessagesService,
  getMessageService,
  removeMessageService,
  updateMessageService,
} from './messages.service';
import { createMessageSchema, getManyMessagesShema, updateMessageSchema } from './messages.validation';

export const createMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = createMessageSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const message = await createMessageService({ data: value });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created message',
    data: message,
  });
};

export const getMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const message = await getMessageService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Message retrieved successfully', data: message });
};

export const getManyMessagesController = async (req: Request, res: Response, _next: NextFunction) => {
  const { query } = req;

  const { error, value } = getManyMessagesShema.validate(query);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const messages = await getManyMessagesService({ queryString: value });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Messages retrieved successfully', data: messages });
};

export const updateMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = updateMessageSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedMessage = await updateMessageService({ data: value, id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated message', data: updatedMessage });
};

export const removeMessageController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeMessageService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
