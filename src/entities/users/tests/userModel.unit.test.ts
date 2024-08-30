/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from '../../../core/AppError';
import { User } from '../users.model';

describe('User model methods', () => {
  const queryMock = jest.fn();
  const checkDatabaseOperationMock = jest.fn();
  describe('User.setRole method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      User.pool = { query: queryMock } as any;
      User.checkDatabaseOperation = checkDatabaseOperationMock;
    });
    it('should return result of the operation', async () => {
      queryMock.mockReturnValue([{ affectedRows: 1 }]);
      checkDatabaseOperationMock.mockReturnValue(undefined);
      const role = 'client';
      const id = 1;
      const updateUserRoleQuery = 'Query';

      const result = await User.setRole({ id, role, updateUserRoleQuery });

      expect(checkDatabaseOperationMock).toHaveBeenCalledWith({ id, operation: 'update', result: 1 });
      expect(queryMock).toHaveBeenCalledWith(updateUserRoleQuery, [role, id]);
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('should throw if result is invalid', async () => {
      queryMock.mockReturnValue([{ affectedRows: 1 }]);
      checkDatabaseOperationMock.mockImplementation(() => {
        throw new AppError('Error');
      });

      const role = 'client';
      const id = 1;
      const updateUserRoleQuery = 'Query';

      expect(async () => await User.setRole({ id, role, updateUserRoleQuery })).rejects.toThrow();
    });
  });

  describe('User.getOneForAuth method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      User.pool = { query: queryMock } as any;
      User.checkDatabaseOperation = checkDatabaseOperationMock;
    });
    it('should return user record', async () => {
      queryMock.mockReturnValue([[{ id: 1, role: 'admin' }]]);
      checkDatabaseOperationMock.mockReturnValue(undefined);

      const id = 1;
      const query = 'Query';

      const result = await User.getOneForAuth({ id, query });

      expect(checkDatabaseOperationMock).toHaveBeenCalledWith({
        id,
        operation: 'get',
        result: { id: 1, role: 'admin' },
      });
      expect(queryMock).toHaveBeenCalledWith(query, [id]);
      expect(result).toEqual({ id: 1, role: 'admin' });
    });

    it('should throw if result is invalid', async () => {
      queryMock.mockReturnValue([[{ id: 1, role: 'admin' }]]);
      checkDatabaseOperationMock.mockImplementation(() => {
        throw new AppError('Error');
      });

      const id = 1;
      const query = 'Query';

      expect(async () => await User.getOneForAuth({ id, query })).rejects.toThrow();
    });
  });
});
