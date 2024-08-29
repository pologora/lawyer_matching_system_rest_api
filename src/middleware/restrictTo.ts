import { NextFunction, Request, Response } from 'express';

import { asyncErrorCatch } from '../utils/errors/asyncErrorCatch';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODES } from '../config/statusCodes';
import { IUser, UserRole } from '../types/IUser';

export const restrictTo = (...allowedRoles: UserRole[]) =>
  asyncErrorCatch(async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const role = (user.role as UserRole) || 'user';

    if (!allowedRoles.includes(role)) {
      const error = new AppError('User does not have permissions', HTTP_STATUS_CODES.FORBIDDEN_403);
      next(error);
    }

    next();
  });
