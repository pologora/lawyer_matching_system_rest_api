import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { ENV_FILES_MAP } from './config/constants';
const envFile = ENV_FILES_MAP.get(process.env.NODE_ENV!);
dotenv.config({ path: envFile });

import { usersRouter } from './entities/users/userRoutes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { AppError } from './core/AppError';
import { HTTP_STATUS_CODES } from './config/statusCodes';
import { authRouter } from './entities/auth/authRoutes';
import { limiter } from './config/rateLimit/rateLimit';
import { logger } from './config/logger/logger';
import { lawyersRouter } from './entities/lawyers/lawyerRoutes';
import { clientsRouter } from './entities/clients/clientRoute';
import { casesRouter } from './entities/cases/cases.route';
import { messagesRoute } from './entities/messages/messageRoutes';
import { reviewsRouter } from './entities/reviews/reviewRoutes';
import { regionsRouter } from './entities/regions/regionRoutes';
import { citiesRouter } from './entities/cities/cities.routes';
import passport from './middleware/passport';
import path from 'node:path/posix';

process.on('uncaughtException', (err) => {
  logger.error(err);

  process.exit(1);
});

const app = express();

// serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

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

// route not found on server
app.use('*', (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS_CODES.NOT_FOUND_404);
});

app.use(globalErrorHandler);

export { app };
