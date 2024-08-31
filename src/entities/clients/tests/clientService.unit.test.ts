/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
import { UserModel } from '../../users/types/userTypes';
import { createClientService } from '../clientService';
import { ClientModel } from '../types/clientTypes';

describe('clientService', () => {
  let mockBuildInsertQuery: jest.Mock;
  let mockSetRole: jest.Mock;
  let mockGetOne: jest.Mock;
  let mockCreateClient: jest.Mock;

  let mockUser: Partial<UserModel>;
  let mockClient: Partial<ClientModel>;

  const mockQuery = 'Query';
  const mockData = { firstName: 'John', lastName: 'Doe', userId: 1 };
  const mockNewClient = { clientId: 1, firstName: 'John', lastName: 'Doe' };

  beforeEach(() => {
    mockCreateClient = jest.fn();
    mockBuildInsertQuery = jest.fn();
    mockGetOne = jest.fn();
    mockSetRole = jest.fn();

    mockClient = {
      create: mockCreateClient,
      getOne: mockGetOne,
    };

    mockUser = {
      setRole: mockSetRole,
    };
  });
  describe('createClientService', () => {
    it('should return new client data', async () => {
      const query = 'Query';
      const values = [1, 2, 4];

      mockBuildInsertQuery.mockReturnValue({ query, values });
      mockCreateClient.mockResolvedValue(mockNewClient.clientId);
      mockSetRole.mockResolvedValue(undefined);
      mockGetOne.mockResolvedValue(mockNewClient);

      const result = await createClientService({
        buildInsertQuery: mockBuildInsertQuery,
        ClientProfile: mockClient as unknown as ClientModel,
        data: mockData,
        getOneClientQuery: mockQuery,
        updateUserRoleQuery: mockQuery,
        User: mockUser as unknown as UserModel,
      });

      expect(result).toEqual(mockNewClient);
    });
  });
});
