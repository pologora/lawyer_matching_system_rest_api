import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './users.controller';

export const usersRouter = express.Router();

usersRouter.route('/users').get(getAllUsers).post(createUser);
usersRouter.route('/users/:id').get(getUserById).delete(deleteUser).patch(updateUser);
