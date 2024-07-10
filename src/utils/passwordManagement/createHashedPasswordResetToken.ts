import { createHash } from 'node:crypto';

export const createPasswordResetHashedToken = (token: string) => {
  return createHash('sha256').update(token).digest('hex');
};
