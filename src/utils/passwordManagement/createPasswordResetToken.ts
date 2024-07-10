import { createHash, randomBytes } from 'node:crypto';

export const createPasswordResetToken = () => {
  const bytesSize = 32;
  const resetToken = randomBytes(bytesSize).toString('hex');

  return createHash('sha256').update(resetToken).digest('hex');
};
