import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { AppError } from '../../utils/errors/AppError';
import {
  CreateUserController,
  GetManyUsersController,
  GetUserController,
  RemoveUserController,
  UpdateUserController,
  UploadUserPhotoController,
} from './types/userTypes';

export const createUserController: CreateUserController =
  ({ User, hashPassword }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const result = await User.create({ email, hashedPassword });

    return res.status(HTTP_STATUS_CODES.CREATED_201).json({
      status: 'success',
      message: 'User created successfully.',
      data: result,
    });
  };

export const getUserController: GetUserController =
  ({ User }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.getOne({ id: Number(req.params.id) });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'User retrieved successfully.',
      data: user,
    });
  };

export const getManyUsersController: GetManyUsersController =
  ({ User, buildGetManyUsersQuery }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const { query, values } = buildGetManyUsersQuery(req.query);

    const users = await User.getMany({ query, values });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'Users retrieved successfully.',
      data: users,
    });
  };

export const updateUserController: UpdateUserController =
  ({ User, buildUpdateTableRowQuery }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = Number(req.params.id);
    const { query, values } = buildUpdateTableRowQuery(req.body, 'User');

    await User.update({ id, query, values });

    const user = await User.getOne({ id });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'User updated successfully.',
      data: user,
    });
  };

export const removeUserController: RemoveUserController =
  ({ User }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    await User.remove({ id: Number(req.params.id) });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).send();
  };

export const uploadUserPhotoController: UploadUserPhotoController =
  ({ User, buildUpdateTableRowQuery }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    if (!req.file) {
      throw new AppError('No file uploaded. Please upload an image file', HTTP_STATUS_CODES.BAD_REQUEST_400);
    }

    const id = Number(req.params.id);
    const { query, values } = buildUpdateTableRowQuery({ profileImageFileName: req.file.filename }, 'User');

    await User.update({ id, query, values });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      status: 'success',
      message: 'User image uploaded successfully',
    });
  };
