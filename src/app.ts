import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ENV_FILES_MAP } from './config/constants';
const envFile = ENV_FILES_MAP.get(process.env.NODE_ENV!);
dotenv.config({ path: envFile });

import { usersRouter } from './entities/users/users.routes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { AppError } from './utils/errors/AppError';
import { HTTP_STATUS_CODES } from './utils/statusCodes';
import { authRouter } from './entities/auth/auth.routes';
import { limiter } from './config/rateLimit/rateLimit';
import { logger } from './config/logger/logger';
import { lawyersRouter } from './entities/lawyers/lawyers.route';
import { clientsRouter } from './entities/clients/clients.route';
import { casesRouter } from './entities/cases/cases.route';
import { messagesRoute } from './entities/messages/messages.route';
import { reviewsRouter } from './entities/reviews/reviews.route';
import { regionsRouter } from './entities/regions/regions.routes';
import { citiesRouter } from './entities/cities/cities.routes';
import passport from './middleware/passport';

process.on('uncaughtException', (err) => {
  logger.error(err);

  process.exit(1);
});

const app = express();

// security headers
app.use('/api', helmet());

// rate limiter
app.use('/api', limiter);

// logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser
app.use(express.json({ limit: '10kb' }));

//cookie parser
app.use(cookieParser());

// passport auth
app.use(passport.initialize());

// api routes
app.use('/api/v1', usersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', lawyersRouter);
app.use('/api/v1', clientsRouter);
app.use('/api/v1', casesRouter);
app.use('/api/v1', messagesRoute);
app.use('/api/v1', reviewsRouter);
app.use('/api/v1', regionsRouter);
app.use('/api/v1', citiesRouter);

app.get('/fail', (req, res) => {
  res.send('Failed');
});

// route not found on server
app.use('*', (req: Request, _res: Response, next: NextFunction) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS_CODES.NOT_FOUND_404);
});

app.use(globalErrorHandler);

export { app };
