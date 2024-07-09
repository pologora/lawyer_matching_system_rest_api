import crypto from 'crypto';
import { createExpiresIn } from './helpers/createExpiresIn';

type Options = {
  expiresIn: string | number;
};

type SignInput = {
  payload: object;
  secret: string;
  options: Options;
};

type CreateSignatureInput = {
  secret: string;
  encodedHeader: string;
  encodedPayload: string;
};

export const createSignature = ({ secret, encodedHeader, encodedPayload }: CreateSignatureInput) => {
  return crypto.createHmac('sha256', secret).update(`${encodedHeader}.${encodedPayload}`).digest('base64');
};

export const sign = ({ payload, secret, options }: SignInput) => {
  const header = { alg: 'HS256', type: 'JWT' };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');

  const expiresIn = createExpiresIn(options.expiresIn);
  const issuedAt = Date.now();

  const encodedPayload = Buffer.from(JSON.stringify({ ...payload, exp: expiresIn, iat: issuedAt })).toString('base64');

  const signature = createSignature({ secret, encodedHeader, encodedPayload });

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
