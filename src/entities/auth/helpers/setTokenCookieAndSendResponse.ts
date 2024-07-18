import { Response } from 'express';
import { StatusCodes } from '../../../utils/statusCodes';
import { getCookieExpireDate } from './getCookieExpireDate';

type TokenResponse = {
  token: string;
  user?: object;
  message: string;
  statusCode: StatusCodes;
};

export const setTokenCookieAndSendResponse = (res: Response, { token, message, user, statusCode }: TokenResponse) => {
  const cookieOptions = {
    expires: getCookieExpireDate({ days: Number(process.env.TOKEN_COOKIE_EXPIRES_IN_DAYS!) }),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  return res.status(statusCode).json({
    status: 'success',
    message,
    data: user,
  });
};
