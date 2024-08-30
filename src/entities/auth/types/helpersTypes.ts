import { Response } from 'express';
import { StatusCode } from '../../../config/statusCodes';

type TokenResponse = {
  token: string;
  user?: object;
  message: string;
  statusCode: StatusCode;
};

export type SetTokenCookieAndSendResponse = (res: Response, props: TokenResponse) => Response;

export type CalculateEmailVerificationExpiraton = () => Date;
