import { getCookieExpireDate } from './getCookieExpireDate';

export const cookieOptions = {
  expires: getCookieExpireDate({ days: Number(process.env.TOKEN_COOKIE_EXPIRES_IN_DAYS!) }),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false,
};
