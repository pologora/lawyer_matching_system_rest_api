import rateLimit from 'express-rate-limit';
import { millisecondsInHour } from '../../utils/jwt/helpers/createExpiresIn';

export const limiter = rateLimit({
  max: 100,
  windowMs: millisecondsInHour,
  message: 'Too many requests from this IP, please try again in an hour.',
});
