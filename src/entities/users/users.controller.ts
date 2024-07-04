import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../utils/statusCodes';
import { createUser, getAllUsers, getUser, removeUser, updateUser } from './users.service';

export const getAll = async (req: Request, res: Response) => {
  const users = await getAllUsers();

  res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    status: 'success',
    data: users,
  });
};

export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUser(id);

  res.json({
    status: 'success',
    data: user,
  });
};

export const create = async (req: Request, res: Response) => {
  const result = await createUser(req.body);

  res.status(HTTP_STATUS_CODES.CREATED_201).json({
    status: 'success',
    data: result,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  await removeUser(id);

  res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await updateUser(id, req.body);

  res.json({
    status: 'success',
    data: result,
  });
};
