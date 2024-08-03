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

export const createClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const client = await createClientService({ data: req.body });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'Successfully created client profile',
    data: client,
  });
};

export const getClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const client = await getClientService({ id });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Client profile retrieved successfully', data: client });
};

export const getManyClientsController = async (_req: Request, res: Response, _next: NextFunction) => {
  const clients = await getManyClientsService();

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Client profiles retrieved successfully',
    data: clients,
  });
};

export const updateClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const updatedClient = await updateClientService({ id, data: req.body });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated client profile', data: updatedClient });
};

export const removeClientController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  await removeClientService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
