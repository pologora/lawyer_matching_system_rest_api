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
import { userCreateSchema, userUpdateSchema } from './users.validation';
import { AppError } from '../../utils/errors/AppError';
import { CreateUserDto } from './dto';
import { validateId } from '../../utils/validateId';

export const createUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password, confirmPassword }: CreateUserDto = req.body;
  const { error, value } = userCreateSchema.validate({ email, password, confirmPassword });

  if (error) {
    throw new AppError(error.message);
  }

  const result = await createUserService({ data: value });

  return res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    message: 'User created successfully.',
    data: result,
  });
};

export const getUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const user = await getUserService({ id });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User retrieved successfully.',
    data: user,
  });
};

export const getManyUsersController = async (_req: Request, res: Response, _next: NextFunction) => {
  const users = await getManyUsersService();

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'Users retrieved successfully.',
    data: users,
  });
};

export const updateUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  const { error, value } = userUpdateSchema.validate(req.body);

  if (error) {
    throw new AppError(error.message);
  }

  const result = await updateUserService({ id, data: value });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: result,
  });
};

export const removeUserController = async (req: Request, res: Response, _next: NextFunction) => {
  const { id: candidateId } = req.params;

  const { id } = validateId(Number(candidateId));

  await removeUserService({ id });

  return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).send();
};

export const uploadUserPhotoController = async (req: Request, res: Response, _next: NextFunction) => {
  if (!req.file) {
    throw new AppError('No file uploaded. Please upload an image file', HTTP_STATUS_CODES.BAD_REQUEST_400);
  }

  const { id: candidateId } = req.params;
  const { id } = validateId(Number(candidateId));

  await uploadUserPhotoService({ id, profileImageFileName: req.file.filename });

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    message: 'User image uploaded successfully',
  });
};
