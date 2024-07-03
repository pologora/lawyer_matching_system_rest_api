import { Request, Response } from 'express';
import { statusCodes } from '../../utils/statusCodes';
import { createUser, getAllUsers, getUser, removeUser, updateUser } from './users.service';

export const getAll = async (req: Request, res: Response) => {
  const users = await getAllUsers();

  res.json({
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
  const result = createUser(req.body);

  res.status(statusCodes.created).json({
    status: 'success',
    data: result,
  });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  await removeUser(id);

  res.status(statusCodes.noContent).end();
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await updateUser(id, req.body);

  res.json({
    status: 'success',
    data: result,
  });
};
