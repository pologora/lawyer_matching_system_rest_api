import { NextFunction, Request, Response } from 'express';

import { asyncErrorCatch } from '../utils/errors/asyncErrorCatch';
import { UserRole } from '../types/userRoles';
import { AppError } from '../utils/errors/AppError';
import { HTTP_STATUS_CODES } from '../utils/statusCodes';

export const restrictTo = (...allowedRoles: UserRole[]) =>
  asyncErrorCatch(async (req: Request, res: Response, next: NextFunction) => {
    const role = (req.user?.role as UserRole) || 'user';

    if (!allowedRoles.includes(role)) {
      throw new AppError('User does not have permissions', HTTP_STATUS_CODES.FORBIDDEN_403);
    }

    next();
  });
