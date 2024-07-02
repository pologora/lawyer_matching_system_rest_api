import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from './users.controller';

export const router = express.Router();

router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').get(getUserById).delete(deleteUser).patch(updateUser);
