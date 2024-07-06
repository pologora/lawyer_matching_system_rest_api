import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { createUser, getAllUsers, getUser, removeUser, updateUser } from './users.service';
import { userCreateSchema, userUpdateSchema } from './users.validation';
import { AppError } from '../../utils/AppError';

export const getAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await getAllUsers();

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Users retrieved successfully.',
    data: users,
  });
};

export const get = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;

  const user = await getUser(id);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User retrieved successfully.',
    data: user,
  });
};

export const create = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, confirmPassword } = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message);
  }

  const result = await createUser(value);

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User created successfully.',
    data: result,
  });
};

export const remove = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;

  await removeUser(id);

  res.status(HTTP_STATUS_CODES.NO_CONTENT_204).send();
};

export const update = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;

  const { error, value } = userUpdateSchema.validate({ email });

  if (error) {
    throw new AppError(error.message);
  }

  const result = await updateUser(id, value);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: result,
  });
};
