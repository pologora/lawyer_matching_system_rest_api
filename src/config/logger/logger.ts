import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, printf, errors } = format;

const customFormat = printf(({ level, message, timestamp: time, stack }) => {
  return `${time} ${level}: ${stack || message}`;
});

export const logger = createLogger({
  format: combine(timestamp(), errors({ stack: true }), customFormat),
  level: 'info',
  transports: [
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: path.join(__dirname, '../../..', 'logs', 'error-%DATE%.log'),
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m',
    }),
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: path.join(__dirname, '../../..', 'logs', 'combined-%DATE%.log'),
      maxFiles: '14d',
      maxSize: '20m',
    }),
  ],
});
