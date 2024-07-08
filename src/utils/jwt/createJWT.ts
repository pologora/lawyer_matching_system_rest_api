import { sign } from './sign';

export const createJWT = (payload: object) => {
  const secret = process.env.TOKEN_SECRET!;
  const expiresIn = process.env.TOKEN_EXPIRES_IN!;
  const options = { expiresIn };

  const token = sign({ payload, secret, options });

  return token;
};
