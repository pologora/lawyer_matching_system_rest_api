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
import {
  changeMyPasswordSchema,
  deleteMeSchema,
  forgotPasswordShema,
  userRegistrationSchema,
  validateEmailSchema,
} from './auth.validation';
import { validateReqBody } from '../../middleware/validateReqBody';

export const authRouter = Router();

authRouter.post('/register', validateReqBody(userRegistrationSchema), asyncErrorCatch(registerController));
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
authRouter.get(
  '/email-verification/:token',
  validateReqBody(validateEmailSchema),
  asyncErrorCatch(verifyEmailcontroller),
);
authRouter.post('/forgot-password', validateReqBody(forgotPasswordShema), asyncErrorCatch(forgotPasswordController));
authRouter.patch('/reset-password/:token', asyncErrorCatch(resetPasswordController));
authRouter.patch(
  '/change-my-password',
  protect,
  validateReqBody(changeMyPasswordSchema),
  asyncErrorCatch(changeMyPasswordController),
);
authRouter.patch('/delete-me', protect, validateReqBody(deleteMeSchema), asyncErrorCatch(deleteMeController));
