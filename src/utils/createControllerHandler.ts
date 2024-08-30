import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../core/BaseController';
import { BaseControllerMethods } from '../core/types/BaseControllerTypes';
import { AppError } from '../core/AppError';

interface CustomControllerMethods {
  uploadPhoto?: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
}

type ExtendedControllerMethods = BaseControllerMethods & CustomControllerMethods;

export const createControllerHandler =
  ({ controller }: { controller: ExtendedControllerMethods & BaseController }) =>
  ({ method }: { method: keyof ExtendedControllerMethods }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const controllerMethod = controller[method];

    if (controllerMethod) {
      return controller[method]!(req, res, next);
    }

    return next(new AppError(`Method ${method} is not defined on the controller.`));
  };
