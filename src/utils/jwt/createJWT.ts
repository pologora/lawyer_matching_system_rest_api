import { AppError } from '../../core/AppError';
import { sign } from './sign';
import { CreateJWT } from './types/JWTTypes';

export const createJWT: CreateJWT = async (payload) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.TOKEN_SECRET!;
    const expiresIn = process.env.TOKEN_EXPIRES_IN!;

    if (!secret || !expiresIn) {
      reject(new AppError('Environment variables for JWT are not set'));
    }
    const options = { expiresIn };

    const token = sign({ options, payload, secret });

    resolve(token);
  });
};
