import { CheckDatabaseOperationResult } from '../types/utils';
import { AppError } from './AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';
import pool from '../config/db.config';

export class BaseModel {
  protected static pool = pool;

  protected static checkDatabaseOperation: CheckDatabaseOperationResult = ({ result, id, operation }) => {
    if (!result) {
      const firstElementIndex = 0;
      const capitalizedOperation = operation.charAt(firstElementIndex).toUpperCase() + operation.slice(1);

      if (operation === 'create') {
        throw new AppError(
          `Failed to create database record. Please try again later.`,
          HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
        );
      }

      throw new AppError(
        `Failed to ${capitalizedOperation}. No record found with ID: ${id}`,
        HTTP_STATUS_CODES.NOT_FOUND_404,
      );
    }
  };
}
