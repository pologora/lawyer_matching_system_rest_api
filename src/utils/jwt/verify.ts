import { decode } from './decode';
import { createSignature } from './sign';

type VerifyInput = {
  token: string;
  secret: string;
};

const isExpired = (exp: number) => {
  const currentDate = Date.now();

  return new Date(exp).getTime() < currentDate;
};

export const verify = ({ token, secret }: VerifyInput) => {
  const parts = token.split('.');

  const partsLength = 3;
  if (parts.length !== partsLength) {
    throw new Error('Invalid token');
  }

  const [encodedHeader, encodedPayload, signature] = parts;

  const candidateSignature = createSignature({
    encodedHeader,
    encodedPayload,
    secret,
  });

  if (signature !== candidateSignature) {
    return null;
  }

  const decoded = decode({ token });

  if (isExpired(decoded.exp)) {
    return null;
  }

  return decoded;
};
