/* eslint-disable sort-keys */
import { cookieOptions } from '../../../config/cookieOptions/cookieOptions';
import { SetTokenCookieAndSendResponse } from '../types/helpersTypes';

export const setTokenCookieAndSendResponse: SetTokenCookieAndSendResponse = (
  res,
  { token, message, user, statusCode },
) => {
  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    message,
    data: user,
  });
};
