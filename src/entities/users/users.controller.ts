import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createUserService,
  getAllUsersService,
  getUserService,
  removeUserService,
  updateUserService,
} from './users.service';
import { userCreateSchema, userUpdateSchema } from './users.validation';
import { AppError } from '../../utils/errors/AppError';
import { CreateUser } from './dto';

export const getAll = async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await getAllUsersService();

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Users retrieved successfully.',
    data: users,
  });
};

export const get = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;

  const user = await getUserService(id);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User retrieved successfully.',
    data: user,
  });
};

export const create = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, confirmPassword }: CreateUser = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message);
  }

  const result = await createUserService(value);

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User created successfully.',
    data: result,
  });
};

export const remove = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;

  await removeUserService(id);

  res.status(HTTP_STATUS_CODES.NO_CONTENT_204).send();
};

export const update = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { email } = req.body;

  const { error, value } = userUpdateSchema.validate({ email });

  if (error) {
    throw new AppError(error.message);
  }

  const result = await updateUserService(id, value);

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: result,
  });
};
