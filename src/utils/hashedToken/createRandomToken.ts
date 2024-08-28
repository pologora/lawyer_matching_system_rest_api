import { randomBytes } from 'node:crypto';
import { CreateRandomToken } from '../../types/utils';

export const createRandomToken: CreateRandomToken = () => {
  const bytesSize = 32;
  const resetToken = randomBytes(bytesSize).toString('hex');

  return resetToken;
};
