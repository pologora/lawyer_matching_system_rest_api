import { Router } from 'express';
import passport from 'passport';

import { loginWithGoogleCallbackController, logoutController } from './authController';
import { asyncErrorCatch } from '../../utils/errors/asyncErrorCatch';
import { protect } from '../../middleware/protect';
import {
  changeMyPasswordSchema,
  deleteMeSchema,
  forgotPasswordShema,
  loginSchema,
  userRegistrationSchema,
} from './authValidation';
import { validateReqBody } from '../../middleware/validateReqBody';
import {
  injectedChangeMyPasswordController,
  injectedDeleteMeController,
  injectedForgotPasswordController,
  injectedGetMeController,
  injectedLoginController,
  injectedRegisterController,
  injectedResetPasswordController,
  injectedVerifyEmailcontroller,
} from './helpers/authInjectedFunctions';

export const authRouter = Router();

authRouter.post('/register', validateReqBody(userRegistrationSchema), asyncErrorCatch(injectedRegisterController));
authRouter.post('/login', validateReqBody(loginSchema), asyncErrorCatch(injectedLoginController));

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
authRouter.get('/me', protect, asyncErrorCatch(injectedGetMeController));
authRouter.get('/email-verification/:token', asyncErrorCatch(injectedVerifyEmailcontroller));
authRouter.post(
  '/forgot-password',
  validateReqBody(forgotPasswordShema),
  asyncErrorCatch(injectedForgotPasswordController),
);
authRouter.patch('/reset-password/:token', asyncErrorCatch(injectedResetPasswordController));
authRouter.patch(
  '/change-my-password',
  protect,
  validateReqBody(changeMyPasswordSchema),
  asyncErrorCatch(injectedChangeMyPasswordController),
);
authRouter.patch('/delete-me', protect, validateReqBody(deleteMeSchema), asyncErrorCatch(injectedDeleteMeController));
