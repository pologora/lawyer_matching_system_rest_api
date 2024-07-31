import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';
import { asyncErrorCatch } from '../utils/errors/asyncErrorCatch';
import { verifyJWT } from '../utils/jwt/verifyJWT';
import { User } from '../entities/users/users.model';

export const protect = asyncErrorCatch(async (req: Request, res: Response, next: NextFunction) => {
  // 1. get token from request and validate
  const token = req.cookies.jwt;

  if (!token) {
    throw new AppError('You are not not logged in. Please log in to get access', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const { id, iat } = await verifyJWT(token);

  // 2. user still exists
  const user = await User.getOne({ id });
  if (!user) {
    throw new AppError(
      'The user belonging to this token no longer exists. Please log in or create an account',
      HTTP_STATUS_CODES.UNAUTHORIZED_401,
    );
  }

  // 3. user didn't change password after token was issued
  const passwordChangedAt = user.passwordChangedAt && new Date(user.passwordChangedAt).getTime();
  const isPasswordChangedAfterTokenIssued = checkPasswordChanged(iat, passwordChangedAt);
  if (isPasswordChangedAfterTokenIssued) {
    throw new AppError('User changed password. Please log in again', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  req.user = user;
  next();
});

function checkPasswordChanged(iat: number, password_changed_at: number | null) {
  const gracePeriod = 10000;
  return password_changed_at && password_changed_at > iat + gracePeriod;
}
