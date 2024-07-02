import { Request, Response } from 'express';
import { User } from './users.model';
import { CreateUser } from './dto/createUser.dto';
import { patchQueryBuilder } from '../../helpers/patchQueryBuilder';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.getAllUsers();

  res.json({
    status: 'success',
    data: users,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.getUser(Number(id));

  res.json({
    status: 'success',
    data: user,
  });
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword }: CreateUser = req.body;

  const result = await User.createUser({ name, email, password });

  res.json({
    status: 'success',
    data: result,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.deleteUserQuery(Number(id));

  res.json({
    status: 'success',
    data: user,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const { query, values } = patchQueryBuilder('users', data, new Set(['name', 'email']));

  const user = await User.updateUser(query, values, Number(id));

  res.json({
    status: 'success',
    data: user,
  });
};
