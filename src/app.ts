/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

import { usersRouter } from './entities/users/users.routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { AppError } from './utils/errors/AppError';
import { HTTP_STATUS_CODES } from './utils/statusCodes';
import { authRouter } from './entities/auth/auth.routes';
import { limiter } from './config/rateLimit/rateLimit';

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANDLER EXEPTION! Shutting down...');

  process.exit(1);
});

const app = express();

// security headers
app.use('/api', helmet());

// rate limiter
app.use('/api', limiter);

// loger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json({ limit: '10kb' }));

// api routes
app.use('/api/v1', usersRouter);
app.use('/api/v1', authRouter);

// route not found on server send error response
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS_CODES.NOT_FOUND_404);

  next(error);
});

app.use(globalErrorHandler);

export { app };
