/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANDLER EXEPTION! Shutting down...');

  process.exit(1);
});

const app = express();

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  //   const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  //   next(error);

  console.log(`Can't find ${req.originalUrl} on this server!`);
  next();
});

export { app };
