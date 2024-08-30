import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { BuildGetManyClientsQuery, ClientModel, CreateClientService } from './types/clientTypes';
import { UserModel } from '../users/types/userTypes';

type ClientControllerConstructorProps = {
  createClientService: CreateClientService;
  updateUserRoleQuery: string;
  User: UserModel;
  buildGetManyClientsQuery: BuildGetManyClientsQuery;
  getOneClientQuery: string;
  Client: ClientModel;
};

export class ClientController extends BaseController {
  createClientService;
  User;
  updateUserRoleQuery;

  constructor({
    createClientService,
    updateUserRoleQuery,
    User,
    buildGetManyClientsQuery,
    getOneClientQuery,
    Client,
  }: ClientControllerConstructorProps) {
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
      getOneClientQuery: this.getOneQuery,
      updateUserRoleQuery: this.updateUserRoleQuery,
    });

    return res.status(this.HTTP_STATUS_CODES.CREATED_201).json({
      data: client,
      message: 'Successfully created client profile',
      status: 'success',
    });
  }
}
