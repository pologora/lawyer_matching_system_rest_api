/* eslint-disable sort-keys */
import { Response } from 'express';
import { StatusCodes } from '../../../utils/statusCodes';
import { cookieOptions } from '../../../config/cookieOptions/cookieOptions';

type TokenResponse = {
  token: string;
  user?: object;
  message: string;
  statusCode: StatusCodes;
};

export const setTokenCookieAndSendResponse = (res: Response, { token, message, user, statusCode }: TokenResponse) => {
  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    message,
    data: user,
  });
};
