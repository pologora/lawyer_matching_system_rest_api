import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import {
  createUserService,
  getManyUsersService,
  getUserService,
  removeUserService,
  updateUserService,
  uploadUserPhotoService,
} from './users.service';
import { AppError } from '../../utils/errors/AppError';
import { validateId } from '../../utils/validateId';

export const createUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const result = await createUserService({ data: req.body });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User created successfully.',
    data: result,
  });
};

export const getUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const user = await getUserService({ id });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User retrieved successfully.',
    data: user,
  });
};

export const getManyUsersController = async (req: Request, res: Response, _next: NextFunction) => {
  const users = await getManyUsersService(req.query);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Users retrieved successfully.',
    data: users,
  });
};

export const updateUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  const result = await updateUserService({ id, data: req.body });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: result,
  });
};

export const removeUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = validateId(Number(req.params.id));

  await removeUserService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).send();
};

export const uploadUserPhotoController = async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.file) {
    throw new AppError('No file uploaded. Please upload an image file', HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const { id } = validateId(Number(req.params.id));

  await uploadUserPhotoService({ id, profileImageFileName: req.file.filename });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User image uploaded successfully',
  });
};
