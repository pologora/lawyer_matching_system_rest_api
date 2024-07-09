import { AppError } from '../errors/AppError';
import { sign } from './sign';

export const createJWT = async (payload: object) => {
  return new Promise((resolve, reject) => {
    const secret = process.env.TOKEN_SECRET!;
    const expiresIn = process.env.TOKEN_EXPIRES_IN!;

    if (!secret || !expiresIn) {
      reject(new AppError('Environment variables for JWT are not set'));
    }
    const options = { expiresIn };

    const token = sign({ payload, secret, options });

    resolve(token);
  });
};
