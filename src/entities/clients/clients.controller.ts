import { NextFunction, Request, Response } from 'express';
import { validateId } from '../../utils/validateId';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createClientService,
  getClientService,
  getManyClientsService,
  removeClientService,
  updateClientService,
} from './clients.service';
import { clientCreateSchema, clientUpdateSchema } from './clients.validation';
import { AppError } from '../../utils/errors/AppError';

export const getClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const client = await getClientService(id);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Client profile retrieved successfully', data: client });
};

export const removeClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeClientService(id);

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};

export const createClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { error, value } = clientCreateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const client = await createClientService(value);

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created client profile',
    data: client,
  });
};

export const updateClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = clientUpdateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const updatedClient = await updateClientService(id, value);

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated client profile', data: updatedClient });
};

export const getManyClientsController = async (req: Request, res: Response, _next: NextFunction) => {
  const clients = await getManyClientsService();

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Client profiles retrieved successfully',
    data: clients,
  });
};
