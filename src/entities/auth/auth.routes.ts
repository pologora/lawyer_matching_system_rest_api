import { Router } from 'express';
import { register } from './auth.controller';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(register));
// authRouter.post('/login', asyncErrorCatch());
// authRouter.post('/reset-password', asyncErrorCatch());
// authRouter.post('/forgot-password', asyncErrorCatch());
