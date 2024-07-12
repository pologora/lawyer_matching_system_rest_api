import { Router } from 'express';

import { changeMyPassword, deleteMe, forgotPassword, login, register, resetPassword } from './auth.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { protect } from '../../middleware/protect';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(register));
authRouter.post('/login', asyncErrorCatch(login));
authRouter.post('/forgot-password', asyncErrorCatch(forgotPassword));
authRouter.patch('/reset-password/:token', asyncErrorCatch(resetPassword));
authRouter.patch('/change-my-password', protect, asyncErrorCatch(changeMyPassword));
authRouter.patch('/delete-me', protect, asyncErrorCatch(deleteMe));
