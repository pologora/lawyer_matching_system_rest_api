import { millisecondsInDay } from '../../../utils/jwt/helpers/createExpiresIn';

export const calculateEmailVerificationExpiraton = () => {
  return new Date(Date.now() + Number(process.env.EMAIL_VERIFICATION_EXPIRES_IN_DAYS) * millisecondsInDay);
};
