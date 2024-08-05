import { NextFunction, Request, Response } from 'express';

import { asyncErrorCatch } from '../utils/errors/asyncErrorCatch';
import { UserRole } from '../types/userRoles';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';
import { IUser } from '../types/user';

export const restrictTo = (...allowedRoles: UserRole[]) =>
  asyncErrorCatch(async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const role = (user.role as UserRole) || 'user';

    if (!allowedRoles.includes(role)) {
      throw new AppError('User does not have permissions', HTTP_STATUS_CODES.FORBIDDEN_403);
    }

    next();
  });
