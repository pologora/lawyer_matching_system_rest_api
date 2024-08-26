import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  CreateClientController,
  GetClientController,
  GetManyClientsController,
  RemoveClientController,
  UpdateClientController,
} from './types/clientTypes';

export const createClientController: CreateClientController =
  ({ createClientService }) =>
  async (req, res, _next) => {
    const client = await createClientService({ data: req.body });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'Successfully created client profile',
      data: client,
    });
  };

export const getClientController: GetClientController =
  ({ ClientProfile, query }) =>
  async (req, res, _next) => {
    const client = await ClientProfile.getOne({ id: Number(req.params.id), query });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Client profile retrieved successfully', data: client });
  };

export const getManyClientsController: GetManyClientsController =
  ({ ClientProfile, query }) =>
  async (_req, res, _next) => {
    const clients = await ClientProfile.getMany({ query });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'Client profiles retrieved successfully',
      data: clients,
    });
  };

export const updateClientController: UpdateClientController =
  ({ ClientProfile, buildUpdateTableRowQuery, getOneClientQuery }) =>
  async (req, res, _next) => {
    const id = Number(req.params.id);
    const { query, values } = buildUpdateTableRowQuery(req.body, 'ClientProfile');

    await ClientProfile.update({
      id,
      query,
      values,
    });

    const updatedClient = await ClientProfile.getOne({ id, query: getOneClientQuery });

    return res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .json({ status: 'success', message: 'Successfully updated client profile', data: updatedClient });
  };

export const removeClientController: RemoveClientController =
  ({ ClientProfile, query }) =>
  async (req, res, _next) => {
    await ClientProfile.remove({ id: Number(req.params.id), query });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };
