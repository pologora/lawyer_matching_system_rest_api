import { Router } from 'express';
import passport from 'passport';

import {
  changeMyPasswordController,
  deleteMeController,
  forgotPasswordController,
  getMeController,
  loginController,
  loginWithGoogleCallbackController,
  logoutController,
  registerController,
  resetPasswordController,
  verifyEmailcontroller,
} from './auth.controller';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { protect } from '../../middleware/protect';

export const authRouter = Router();

authRouter.post('/register', asyncErrorCatch(registerController));
authRouter.post('/login', asyncErrorCatch(loginController));

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  }),
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL_ERROR,
    session: false,
  }),
  asyncErrorCatch(loginWithGoogleCallbackController),
);

authRouter.get('/logout', asyncErrorCatch(logoutController));
authRouter.get('/me', protect, asyncErrorCatch(getMeController));
authRouter.get('/email-verification/:token', asyncErrorCatch(verifyEmailcontroller));
authRouter.post('/forgot-password', asyncErrorCatch(forgotPasswordController));
authRouter.patch('/reset-password/:token', asyncErrorCatch(resetPasswordController));
authRouter.patch('/change-my-password', protect, asyncErrorCatch(changeMyPasswordController));
authRouter.patch('/delete-me', protect, asyncErrorCatch(deleteMeController));
