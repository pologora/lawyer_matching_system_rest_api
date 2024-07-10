import { randomBytes } from 'node:crypto';

export const createPasswordResetToken = () => {
  const bytesSize = 32;
  const resetToken = randomBytes(bytesSize).toString('hex');

  return resetToken;
};
