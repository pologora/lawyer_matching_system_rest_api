/* eslint-disable max-lines-per-function */
/* eslint-disable sort-keys */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { globalErrorHandler } from '../globalErrorHandler';
import { logger } from '../../config/logger/logger';

jest.mock('../../config/logger/logger');

describe('globalErrorHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle operational error in development mode', () => {
    process.env.NODE_ENV = 'development';

    const err = new AppError('Operational error', HTTP_STATUS_CODES.BAD_REQUEST_400);
    globalErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(res.json).toHaveBeenCalledWith({
      err,
      message: 'Operational error',
      stack: err.stack,
      status: 'error',
    });
  });

  it('should handle operational error in production mode', () => {
    process.env.NODE_ENV = 'production';

    const err = new AppError('Operational error', HTTP_STATUS_CODES.BAD_REQUEST_400, true);
    globalErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Operational error',
      status: 'error',
    });
  });

  it('should handle non-operational error in production mode', () => {
    process.env.NODE_ENV = 'production';

    const err = new Error('Non-operational error') as AppError;
    err.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500;
    err.isOperational = false;

    globalErrorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong, please try again later.',
      status: 'error',
    });
  });

  it('should log the error if status code is 500 in any environment', () => {
    process.env.NODE_ENV = 'production';

    const err = new Error('Server error') as AppError;
    err.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500;

    globalErrorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  });

  it('should convert specific SQL errors to AppError', () => {
    process.env.NODE_ENV = 'production';

    const duplicateError = { errno: 1062, message: 'Duplicate entry' } as unknown as AppError;
    globalErrorHandler(duplicateError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.BAD_REQUEST_400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Duplicate entry',
      status: 'error',
    });
  });

  it('should handle unknown errors in production mode', () => {
    process.env.NODE_ENV = 'production';

    const err = new Error('Unknown error') as AppError;

    globalErrorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong, please try again later.',
      status: 'error',
    });
  });
});
