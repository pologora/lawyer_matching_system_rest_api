import { createHash } from 'node:crypto';
import { CreateHashedToken } from '../../types/utils';

export const createHashedToken: CreateHashedToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
};
