import { Router } from 'express';

import { forgotPassword, login, register, resetPassword } from './auth.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(register));
authRouter.post('/login', asyncErrorCatch(login));
authRouter.post('/forgot-password', asyncErrorCatch(forgotPassword));
authRouter.post('/reset-password', asyncErrorCatch(resetPassword));
