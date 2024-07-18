import { Router } from 'express';

import {
  changeMyPasswordController,
  deleteMeController,
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from './auth.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { protect } from '../../middleware/protect';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(registerController));
authRouter.post('/login', asyncErrorCatch(loginController));
authRouter.post('/forgot-password', asyncErrorCatch(forgotPasswordController));
authRouter.patch('/reset-password/:token', asyncErrorCatch(resetPasswordController));
authRouter.patch('/change-my-password', protect, asyncErrorCatch(changeMyPasswordController));
authRouter.patch('/delete-me', protect, asyncErrorCatch(deleteMeController));
