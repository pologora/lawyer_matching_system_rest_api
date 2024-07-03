import express from 'express';
import { create, remove, getAll, get, update } from './users.controller';

export const usersRouter = express.Router();

usersRouter.route('/users').get(getAll).post(create);
usersRouter.route('/users/:id').get(get).delete(remove).patch(update);
