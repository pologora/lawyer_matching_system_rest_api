import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';
import { asyncErrorCatch } from '../utils/errors/asyncErrorCatch';
import { verifyJWT } from '../utils/jwt/varifyJWT';
import { User } from '../entities/users/users.model';

export const protect = asyncErrorCatch(async (req: Request, res: Response, next: NextFunction) => {
  // 1. get token from request and validate
  const bearer = req.headers.authorization?.split(' ')[0];
  const token = req.headers.authorization?.split(' ')[1];
  if (!req.headers.authorization || bearer !== 'Bearer' || !token) {
    throw new AppError('You are not not logged in. Please log in to get access', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  const { id, iat } = await verifyJWT(token);

  // 2. user still exists
  const user = await User.get(id);
  if (!user) {
    throw new AppError('The user belonging to this token no longer exists', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  // 3. user change password after token was issued
  const passwordChangedAt = user.password_changed_at && new Date(user.password_changed_at).getTime();
  const isPasswordChangedAfterTokenIssued = checkPasswordChanged(iat, passwordChangedAt);
  if (isPasswordChangedAfterTokenIssued) {
    throw new AppError('User changed password. Please log in again.', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  req.user = user;
  next();
});

function checkPasswordChanged(iat: number, password_changed_at: number | null) {
  return password_changed_at && password_changed_at > iat;
}