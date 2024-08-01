import { randomBytes } from 'node:crypto';

export const createRandomToken = () => {
  const bytesSize = 32;
  const resetToken = randomBytes(bytesSize).toString('hex');

  return resetToken;
};
