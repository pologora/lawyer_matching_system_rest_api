/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { createControllerHandler } from '../createControllerHandler';
import { AppError } from '../../core/AppError';

describe('createControllerHandler', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let mockController: any;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
    mockController = {
      create: jest.fn().mockResolvedValue(res),
      uploadPhoto: jest.fn().mockResolvedValue(res),
    };
  });

  it('should call the correct method on the controller when it exists', async () => {
    const handler = createControllerHandler({ controller: mockController })({ method: 'create' });

    await handler(req, res, next);

    expect(mockController.create).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call the correct custom method on the controller when it exists', async () => {
    const handler = createControllerHandler({ controller: mockController })({ method: 'uploadPhoto' });

    await handler(req, res, next);

    expect(mockController.uploadPhoto).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with an AppError if the method does not exist', async () => {
    // @ts-expect-error test not existing method
    const handler = createControllerHandler({ controller: mockController })({ method: 'nonExistentMethod' });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(mockController.create).not.toHaveBeenCalled();
  });
});
