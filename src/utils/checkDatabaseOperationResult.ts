import { AppError } from './errors/AppError';
import { HTTP_STATUS_CODES } from './statusCodes';

type DatabaseOperations = 'update' | 'remove' | 'get' | 'create';

type CheckDatabaseOperationInput = {
  result: object | undefined | number;
  id: number;
  operation: DatabaseOperations;
};

export const checkDatabaseOperation = ({ result, id, operation }: CheckDatabaseOperationInput) => {
  if (!result) {
    const firstElementIndex = 0;
    const capitalizedOperation = operation.charAt(firstElementIndex).toUpperCase() + operation.slice(1);

    throw new AppError(
      `Failed to ${capitalizedOperation}. No record found with ID: ${id}`,
      HTTP_STATUS_CODES.NOT_FOUND_404,
    );
  }
};
