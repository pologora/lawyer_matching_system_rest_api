import Joi from 'joi';
import { validateReqQuery } from '../validateReqQuery';
import { Request, Response } from 'express';
import { AppError } from '../../core/AppError';
import { validateReqBody } from '../validateReqBody';
import { validateIdParameter } from '../validateIdParameter';
import { restrictTo } from '../restrictTo';
import { UserRole } from '../../types/IUser';

describe('validateReqQuery middleware function', () => {
  const request = { query: { id: 123 } } as unknown as Request;
  const res = {} as unknown as Response;
  const next = jest.fn();
  it('should call next with no arguments if schema is valid', () => {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const middleware = validateReqQuery(schema);
    middleware(request, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with AppError if schema is invalid', () => {
    const schema = Joi.object({
      notExists: Joi.number().required(),
    });

    const middleware = validateReqQuery(schema);
    middleware(request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('validateReqBody middleware function', () => {
  const request = { body: { id: 123 } } as unknown as Request;
  const res = {} as unknown as Response;
  const next = jest.fn();
  it('should call next with no arguments if schema is valid', () => {
    const schema = Joi.object({
      id: Joi.number().required(),
    });

    const middleware = validateReqBody(schema);
    middleware(request, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with AppError if schema is invalid', () => {
    const schema = Joi.object({
      notExists: Joi.number().required(),
    });

    const middleware = validateReqBody(schema);
    middleware(request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('validateIdParameter middleware function', () => {
  const res = {} as unknown as Response;
  const next = jest.fn();
  it('should call next with no arguments if schema is valid', () => {
    const request = { params: { id: 123 } } as unknown as Request;
    validateIdParameter(request, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with AppError if schema is invalid', () => {
    const request = { params: { id: 'wrong' } } as unknown as Request;
    validateIdParameter(request, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});

describe('restrictTo middleware function', () => {
  const allowedRoles = ['admin', 'client'] as UserRole[];
  const response = {} as unknown as Response;
  const next = jest.fn();
  it('should call next with no arguments if user has access', async () => {
    const request = { user: { role: 'admin' } } as unknown as Request;

    const middleware = restrictTo(...allowedRoles);
    await middleware(request, response, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with AppError as argument if user has no access', async () => {
    const request = { user: { role: 'lawyer' } } as unknown as Request;

    // @ts-expect-error error
    const middleware = restrictTo(allowedRoles);
    await middleware(request, response, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
