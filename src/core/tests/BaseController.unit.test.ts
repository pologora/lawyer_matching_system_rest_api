/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */

import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../BaseController';

describe('BaseController', () => {
  let controller: BaseController;
  const mockModel = {
    create: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let mockEnd: jest.Mock;

  const tableName = 'User';
  const getOneQuery = 'SELECT * FROM TestTable WHERE id = ?';

  beforeEach(() => {
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    mockEnd = jest.fn().mockReturnThis();

    mockResponse = {
      status: mockStatus,
      json: mockJson,
      end: mockEnd,
    } as unknown as Response;

    mockRequest = {} as unknown as Request;

    mockNextFunction = jest.fn();

    controller = new BaseController({
      model: mockModel,
      tableName,
      buildInsertQuery: jest.fn().mockReturnValue({ query: 'INSERT INTO TestTable ...', values: [] }),
      buildRemoveQuery: jest.fn().mockReturnValue('DELETE FROM TestTable WHERE id = ?'),
      buildUpdateQuery: jest.fn().mockReturnValue({ query: 'UPDATE TestTable SET ... WHERE id = ?', values: [] }),
      buildGetManyQuery: jest.fn().mockReturnValue({ query: 'SELECT * FROM TestTable ...', values: [] }),
      getOneQuery,
    });
  });

  describe('create', () => {
    it('should create a new record and return it', async () => {
      mockRequest.body = { field: 'value' };
      mockModel.create.mockResolvedValue(1);
      mockModel.getOne.mockResolvedValue({ id: 1, field: 'value' });

      await controller.create(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockModel.create).toHaveBeenCalledWith({ query: 'INSERT INTO TestTable ...', values: [] });
      expect(mockModel.getOne).toHaveBeenCalledWith({ id: 1, query: getOneQuery });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        data: { id: 1, field: 'value' },
        message: `Successfully created ${tableName.toLowerCase()}`,
        status: 'success',
      });
    });
  });

  describe('getOne', () => {
    it('should retrieve a record by id', async () => {
      mockRequest.params = { id: '1' };
      mockModel.getOne.mockResolvedValue({ id: 1, field: 'value' });

      await controller.getOne(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockModel.getOne).toHaveBeenCalledWith({ id: 1, query: getOneQuery });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        data: { id: 1, field: 'value' },
        message: `${tableName} retrieved successfully`,
        status: 'success',
      });
    });
  });

  describe('getMany', () => {
    it('should retrieve multiple records based on query', async () => {
      mockRequest.query = { field: 'value' };
      mockModel.getMany.mockResolvedValue([
        { id: 1, field: 'value' },
        { id: 2, field: 'value2' },
      ]);

      await controller.getMany(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockModel.getMany).toHaveBeenCalledWith({ query: 'SELECT * FROM TestTable ...', values: [] });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        data: [
          { id: 1, field: 'value' },
          { id: 2, field: 'value2' },
        ],
        message: `${tableName} list retrieved successfully`,
        status: 'success',
      });
    });
  });

  describe('update', () => {
    it('should update a record and return the updated record', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { field: 'new value' };
      mockModel.update.mockResolvedValue(undefined);
      mockModel.getOne.mockResolvedValue({ id: 1, field: 'new value' });

      await controller.update(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockModel.update).toHaveBeenCalledWith({
        id: 1,
        query: 'UPDATE TestTable SET ... WHERE id = ?',
        values: [],
      });
      expect(mockModel.getOne).toHaveBeenCalledWith({ id: 1, query: getOneQuery });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        data: { id: 1, field: 'new value' },
        message: `Successfully updated ${tableName.toLowerCase()}`,
        status: 'success',
      });
    });
  });

  describe('remove', () => {
    it('should remove a record by id and return no content', async () => {
      mockRequest.params = { id: '1' };
      mockModel.remove.mockResolvedValue(undefined);

      await controller.remove(mockRequest as Request, mockResponse as Response, mockNextFunction);

      expect(mockModel.remove).toHaveBeenCalledWith({ id: 1, query: 'DELETE FROM TestTable WHERE id = ?' });
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });
  });
});
