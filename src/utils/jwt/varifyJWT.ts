import { AuthPayload } from '../../types/authPayload';
import { AppError } from '../errors/AppError';
import { verify } from './verify';

export const verifyJWT = async (token: string): Promise<AuthPayload> => {
  return new Promise((resolve, reject) => {
    const secret = process.env.TOKEN_SECRET!;

    if (!secret) {
      reject(new AppError('Token secret environment variable is not set'));
    }

    let payload: AuthPayload;
    let error: Error;

    try {
      payload = verify({ token, secret });
      resolve(payload);
    } catch (err) {
      error = err as Error;
      reject(new AppError(error.message));
    }
  });
};
