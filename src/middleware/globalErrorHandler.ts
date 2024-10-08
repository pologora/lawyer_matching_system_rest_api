import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES, StatusCode } from '../config/statusCodes';
import { AppError } from '../core/AppError';
import { logger } from '../config/logger/logger';

const sendDevError = (err: AppError, res: Response, statusCode: StatusCode) => {
  const { status, message, stack } = err;
  res.status(statusCode).json({ err, message, stack, status });
};

const sendProductionError = (err: AppError, res: Response, statusCode: StatusCode) => {
  const { status, message, isOperational, toLog } = err;
  const clientMessage = isOperational ? message : 'Something went wrong, please try again later.';

  if (!isOperational || toLog) {
    logger.error(err);
  }

  res.status(statusCode).json({ message: clientMessage, status: status || 'error' });
};

export const globalErrorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const sqlDuplicateUniqErrorCode = 1062;
  const failedForeignKeyCode = 1452;
  if (err.errno === sqlDuplicateUniqErrorCode || err.errno === failedForeignKeyCode) {
    err = new AppError(err.message);
  }

  const statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500;

  if (err.statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500) {
    logger.error(err);
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    sendDevError(err, res, statusCode);
  } else {
    sendProductionError(err, res, statusCode);
  }
};
