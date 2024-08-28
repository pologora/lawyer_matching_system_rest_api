import { IsTokenExpired } from '../types/utils';

export const isTokenExpired: IsTokenExpired = (resetTokenExpire) => {
  const now = Date.now();
  const exp = new Date(resetTokenExpire).getTime();

  return now > exp;
};
