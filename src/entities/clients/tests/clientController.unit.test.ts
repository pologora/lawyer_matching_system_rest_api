/* eslint-disable sort-keys */
import { Request, Response } from 'express';
import { ClientController } from '../ClientController';
import { ClientModel } from '../types/clientTypes';
import { UserModel } from '../../users/types/userTypes';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';

describe('ClientController', () => {
  let mockBuildGetManyClientsQuery: jest.Mock;
  let mockCreateClientService: jest.Mock;
  let mockClient: Partial<ClientModel>;
  let mockUser: Partial<UserModel>;

  const req = {
    body: {},
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  const mockQuery = 'Query';

  beforeEach(() => {
    mockBuildGetManyClientsQuery = jest.fn();
    mockCreateClientService = jest.fn();
  });

  describe('create', () => {
    const mockNewClient = { clientId: 1 };

    it('should send response with created client data', async () => {
      mockCreateClientService.mockResolvedValue(mockNewClient);

      const clientController = new ClientController({
        buildGetManyClientsQuery: mockBuildGetManyClientsQuery,
        Client: mockClient as unknown as ClientModel,
        createClientService: mockCreateClientService,
        getOneClientQuery: mockQuery,
        updateUserRoleQuery: mockQuery,
        User: mockUser as unknown as UserModel,
      });

      await clientController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.CREATED_201);
      expect(res.json).toHaveBeenCalledWith({
        data: mockNewClient,
        message: 'Successfully created client profile',
        status: 'success',
      });
    });
  });
});
