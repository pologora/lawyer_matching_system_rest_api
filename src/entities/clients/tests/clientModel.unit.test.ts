/* eslint-disable sort-keys */
import { Pool } from 'mysql2/promise';
import { Client } from '../Client';

describe('Client', () => {
  let mockCheckDatabaseOperation: jest.Mock;
  let mockPool: Partial<Pool>;
  let mockQuery: jest.Mock;

  const mockClient = { cliendId: 1, userId: 2 };

  beforeEach(() => {
    mockQuery = jest.fn();
    mockPool = { query: mockQuery };
    mockCheckDatabaseOperation = jest.fn();
  });
  describe('getOneByUserId', () => {
    it('should return client', async () => {
      Client.pool = mockPool as unknown as Pool;
      Client.checkDatabaseOperation = mockCheckDatabaseOperation;
      const userId = 1;
      const query = 'Query';

      mockQuery.mockResolvedValue([[mockClient]]);
      mockCheckDatabaseOperation.mockReturnValue(undefined);

      const result = await Client.getOneByUserId({ userId, query });

      expect(mockQuery).toHaveBeenCalledWith(query, [userId]);
      expect(mockCheckDatabaseOperation).toHaveBeenCalledWith({ id: userId, operation: 'get', result: mockClient });
      expect(result).toEqual(mockClient);
    });
  });
});
