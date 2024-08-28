/* eslint-disable sort-keys */

import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { AppError } from '../AppError';
import { BaseModel } from '../BaseModel';

describe('BaseModel', () => {
  describe('checkDatabaseOperation', () => {
    it('should not throw an error if the operation is successful', () => {
      expect(() => {
        BaseModel.checkDatabaseOperation({
          result: 1,
          id: 1,
          operation: 'get',
        });
      }).not.toThrow();
    });

    it('should throw an AppError with correct message for create operation failure', () => {
      expect(() => {
        BaseModel.checkDatabaseOperation({
          result: 0,
          id: 1,
          operation: 'create',
        });
      }).toThrow(
        new AppError(
          'Failed to create database record. Please try again later.',
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
        ),
      );
    });

    it('should throw an AppError with correct message for other operations failure', () => {
      expect(() => {
        BaseModel.checkDatabaseOperation({
          result: 0,
          id: 1,
          operation: 'get',
        });
      }).toThrow(new AppError('Failed to Get. No record found with ID: 1', HTTP_STATUS_CODES.NOT_FOUND_404));
    });

    it('should capitalize the operation name in the error message', () => {
      expect(() => {
        BaseModel.checkDatabaseOperation({
          result: 0,
          id: 1,
          operation: 'update',
        });
      }).toThrow(new AppError('Failed to Update. No record found with ID: 1', HTTP_STATUS_CODES.NOT_FOUND_404));
    });
  });
});
