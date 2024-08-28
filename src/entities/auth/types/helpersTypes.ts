import { Response } from 'express';
import { StatusCodes } from '../../../config/statusCodes';

type TokenResponse = {
  token: string;
  user?: object;
  message: string;
  statusCode: StatusCodes;
};

export type SetTokenCookieAndSendResponse = (res: Response, props: TokenResponse) => Response;

export type CalculateEmailVerificationExpiraton = () => Date;
