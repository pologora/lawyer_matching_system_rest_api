import { idValidationSchema } from '../validation/idValidationSchema';
import { AppError } from './errors/AppError';
import { HTTP_STATUS_CODES } from './statusCodes';

export const validateId = (id: number) => {
  const { error, value } = idValidationSchema.validate({ id });

  if (error) {
    throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  return value;
};
