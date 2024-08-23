import { NextFunction, Request, Response } from 'express';
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
  const client = await getClientService({ id: Number(req.params.id) });

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
  const updatedClient = await updateClientService({ id: Number(req.params.id), data: req.body });

  return res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .json({ status: 'success', message: 'Successfully updated client profile', data: updatedClient });
};

export const removeClientController = async (req: Request, res: Response, _next: NextFunction) => {
  await removeClientService({ id: Number(req.params.id) });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};
