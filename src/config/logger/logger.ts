import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf, errors } = format;

const customFormat = printf(({ level, message, timestamp_, stack }) => {
  return `${timestamp_} ${level}: ${stack || message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), errors({ stack: true }), customFormat),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../../..', 'logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../../..', 'logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
