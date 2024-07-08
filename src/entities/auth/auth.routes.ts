import { Router } from 'express';
import { login, register } from './auth.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(register));
authRouter.post('/login', asyncErrorCatch(login));
// authRouter.post('/reset-password', asyncErrorCatch());
// authRouter.post('/forgot-password', asyncErrorCatch());
