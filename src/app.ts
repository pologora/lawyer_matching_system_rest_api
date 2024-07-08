/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

import { usersRouter } from './entities/users/users.routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { AppError } from './utils/errors/AppError';
import { HTTP_STATUS_CODES } from './utils/statusCodes';
import { authRouter } from './entities/auth/auth.routes';

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANDLER EXEPTION! Shutting down...');

  process.exit(1);
});

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1', usersRouter);
app.use('/api/v1', authRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS_CODES.NOT_FOUND_404);

  next(error);
});

app.use(globalErrorHandler);

export { app };
