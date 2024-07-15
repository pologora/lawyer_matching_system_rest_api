import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES, StatusCodes } from '../utils/statusCodes';
import { AppError } from '../utils/errors/AppError';
import { logger } from '../config/logger/logger';

const sendDevError = (err: AppError, res: Response, statusCode: StatusCodes) => {
  const { status, message, stack } = err;
  res.status(statusCode).json({ status, message, stack, err });
};

const sendProductionError = (err: AppError, res: Response, statusCode: StatusCodes) => {
  const { status, message, isOperational, toLog } = err;
  const clientMessage = isOperational ? message : 'Something went wrong, please try again later.';

  if (!isOperational || toLog) {
    logger.error(err);
  }

  res.status(statusCode).json({ status: status || 'error', message: clientMessage });
};

export const globalErrorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const sqlDuplicateUniqErrorCode = 1062;
  if (err.errno === sqlDuplicateUniqErrorCode) {
    err = new AppError(err.message);
  }

  const statusCode = err.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500;

  if (err.statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500) {
    logger.error(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res, statusCode);
  } else {
    sendProductionError(err, res, statusCode);
  }
};
