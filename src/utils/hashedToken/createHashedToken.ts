import { createHash } from 'node:crypto';

export const createHashedToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
