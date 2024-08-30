import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { Client } from './Client';
import { getOneClientQuery } from './slqQueries';
import { ClientModel, CreateClientService } from './types/clientTypes';
import { UserModel } from '../users/types/userTypes';
import { buildGetManyClientsQuery } from './helpers/buildGetManyClientsQuery';

type ClientControllerConstructorProps = {
  createClientService: CreateClientService;
  updateUserRoleQuery: string;
  User: UserModel;
};

export class ClientController extends BaseController {
  createClientService;
  User;
  updateUserRoleQuery;

  constructor({ createClientService, updateUserRoleQuery, User }: ClientControllerConstructorProps) {
    super({
      buildGetManyQuery: buildGetManyClientsQuery,
      getOneQuery: getOneClientQuery,
      model: Client,
      tableName: 'ClientProfile',
    });

    this.createClientService = createClientService;
    this.User = User;
    this.updateUserRoleQuery = updateUserRoleQuery;
  }

  async create(req: Request, res: Response, _next: NextFunction) {
    const client = await this.createClientService({
      ClientProfile: this.model as ClientModel,
      User: this.User,
      buildInsertQuery: this.buildInsertQuery,
      data: req.body,
      getOneClientQuery,
      updateUserRoleQuery: this.updateUserRoleQuery,
    });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: client,
      message: 'Successfully created client profile',
      status: 'success',
    });
  }
}

// export const createClientController: CreateClientController =
//   ({ createClientService }) =>
//   async (req, res, _next) => {
//     const client = await createClientService({ data: req.body });

//     return res.status(HTTP_STATUS_CODES.CREATED_201).json({
//       status: 'success',
//       message: 'Successfully created client profile',
//       data: client,
//     });
//   };

// export const getManyClientsController: GetManyClientsController =
//   ({ ClientProfile, query }) =>
//   async (_req, res, _next) => {
//     const clients = await ClientProfile.getMany({ query });

//     return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
//       status: 'success',
//       message: 'Client profiles retrieved successfully',
//       data: clients,
//     });
//   };
