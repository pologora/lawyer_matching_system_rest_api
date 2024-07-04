/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

import { usersRouter } from './entities/users/users.routes';

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

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  //   const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  //   next(error);

  console.log(`Can't find ${req.originalUrl} on this server!`);
  next();
});

export { app };
