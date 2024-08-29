/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { AppError } from '../AppError';
import { CRUDModel } from '../CRUDModel';

describe('CRUDModel class', () => {
  const mockQuery = jest.fn();
  const mockCheckDatabaseOperation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    CRUDModel.pool = { query: mockQuery } as any;
    CRUDModel.checkDatabaseOperation = mockCheckDatabaseOperation;
  });

  describe('CRUDModel.create method', () => {
    it('should return insertedId number', async () => {
      mockQuery.mockResolvedValueOnce([{ affectedRows: 1, insertId: 1 }]);
      mockCheckDatabaseOperation.mockReturnValue(undefined);

      const query = 'INSERT INTO table_name (column) VALUES (?)';
      const values = ['value'];

      const result = await CRUDModel.create({ query, values });

      expect(mockQuery).toHaveBeenCalledWith('INSERT INTO table_name (column) VALUES (?)', ['value']);
      expect(mockCheckDatabaseOperation).toHaveBeenCalledWith({ operation: 'create', result: 1 });
      expect(result).toBe(1);
    });

    it('should throw if the operation is unsuccessful', async () => {
      const error = new AppError('Smth goes wrong', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
      mockQuery.mockResolvedValueOnce([{ affectedRows: 0, insertId: 0 }]);
      mockCheckDatabaseOperation.mockImplementation(() => {
        throw error;
      });

      const query = 'INSERT INTO table_name (column) VALUES (?)';
      const values = ['value'];

      await expect(
        CRUDModel.create({
          query,
          values,
        }),
      ).rejects.toThrow(AppError);
    });
  });

  describe('CRUDModel.getone method', () => {
    const query = `SELECT tableId FROM Table where tableId = ?;`;
    const id = 1;
    it('should return a record', async () => {
      mockQuery.mockResolvedValue([[{ id: 1, value: 'value' }]]);
      mockCheckDatabaseOperation.mockReturnValue(undefined);

      const result = await CRUDModel.getOne({ query, id });

      expect(mockQuery).toHaveBeenCalledWith(query, [id]);
      expect(mockCheckDatabaseOperation).toHaveBeenCalledWith({
        operation: 'get',
        result: { id: 1, value: 'value' },
        id,
      });
      expect(result).toEqual({ id: 1, value: 'value' });
    });

    it('should throw if the operation is unsuccessful', async () => {
      mockQuery.mockResolvedValue([[{ id: 1, value: 'value' }]]);
      mockCheckDatabaseOperation.mockImplementation(() => {
        throw new AppError('Error');
      });

      expect(async () => await CRUDModel.getOne({ query, id })).rejects.toThrow();
    });
  });

  describe('CRUDModel.getMany method', () => {
    it('should return a list of records', async () => {
      mockQuery.mockResolvedValue([
        [
          { id: 1, value: 'value' },
          { id: 2, value: 'value2' },
        ],
      ]);

      const query = 'Query';
      const values = [1, 2, 3];

      const result = await CRUDModel.getMany({ query, values });

      expect(mockQuery).toHaveBeenCalledWith(query, values);
      expect(result).toEqual([
        { id: 1, value: 'value' },
        { id: 2, value: 'value2' },
      ]);
    });
  });

  describe('CRUDModel.update method', () => {
    const query = 'Query';
    const values = [1, 2, 3];
    const id = 4;
    it('should return a number affected rows', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
      mockCheckDatabaseOperation.mockReturnValue(undefined);

      const result = await CRUDModel.update({ query, values, id });

      expect(mockQuery).toHaveBeenCalledWith(query, [...values, id]);
      expect(mockCheckDatabaseOperation).toHaveBeenCalledWith({ operation: 'update', id, result: 1 });
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('should throw if the operation is unsuccessful', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
      mockCheckDatabaseOperation.mockImplementation(() => {
        throw new AppError('Error');
      });

      expect(async () => await CRUDModel.update({ query, values, id })).rejects.toThrow();
    });
  });

  describe('CRUDModel.remove method', () => {
    const query = 'Query';
    const id = 4;

    it('should return a number affected rows', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 1 }]);
      mockCheckDatabaseOperation.mockReturnValue(undefined);

      const result = await CRUDModel.remove({ query, id });

      expect(mockQuery).toHaveBeenCalledWith(query, [id]);
      expect(mockCheckDatabaseOperation).toHaveBeenCalledWith({ operation: 'remove', id, result: 1 });
      expect(result).toEqual({ affectedRows: 1 });
    });

    it('should throw if the operation is unsuccessful', async () => {
      mockQuery.mockResolvedValue([{ affectedRows: 0 }]);
      mockCheckDatabaseOperation.mockImplementation(() => {
        throw new AppError('Error');
      });

      expect(async () => await CRUDModel.remove({ query, id })).rejects.toThrow();
    });
  });
});
