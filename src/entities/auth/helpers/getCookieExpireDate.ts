import { millisecondsInDay } from '../../../utils/jwt/helpers/createExpiresIn';

type GetCookieExpireDateInput = {
  days: number;
  currentDate?: number;
};

export const getCookieExpireDate = ({ days, currentDate = Date.now() }: GetCookieExpireDateInput) => {
  return new Date(currentDate + days * millisecondsInDay);
};
