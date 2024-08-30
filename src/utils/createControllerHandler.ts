import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../core/BaseController';
import { BaseControllerMethods } from '../core/types/BaseControllerTypes';

export const createControllerHandler =
  ({ controller }: { controller: BaseControllerMethods & BaseController }) =>
  ({ method }: { method: keyof BaseControllerMethods }) =>
  (req: Request, res: Response, next: NextFunction) => {
    return controller[method](req, res, next);
  };
