import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODES } from '../../config/statusCodes';

import { cookieOptions } from '../../config/cookieOptions/cookieOptions';
import { IUser } from '../../types/IUser';
import { resetPasswordSchema } from './authValidation';
import {
  ChangeMyPasswordController,
  DeleteMeController,
  ForgotPasswordController,
  GetMeController,
  LoginController,
  LoginWithGoogleCallbackController,
  LogoutController,
  RegisterController,
  ResetPasswordController,
  VerifyEmailcontroller,
} from './types/authControllerTypes';

export const registerController: RegisterController =
  ({ registerService, setTokenCookieAndSendResponse }) =>
  async (req, res, _next) => {
    const token = await registerService({ req });

    return setTokenCookieAndSendResponse(res, {
      message: 'User registered successfully',
      statusCode: HTTP_STATUS_CODES.CREATED_201,
      token,
    });
  };

export const loginController: LoginController =
  ({ loginService, setTokenCookieAndSendResponse }) =>
  async (req, res, _next) => {
    const { token, user } = await loginService(req.body);

    return setTokenCookieAndSendResponse(res, {
      message: 'User login successfully',
      statusCode: HTTP_STATUS_CODES.SUCCESS_200,
      token,
      user,
    });
  };

export const getMeController: GetMeController =
  ({ getMeService }) =>
  async (req, res, _next) => {
    const { user } = req;

    const { role, userId, googleId, isVerified, email, createdAt, updatedAt } = user as IUser;

    const profile = await getMeService({ role, userId });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: {
        createdAt,
        email,
        googleId,
        isVerified,
        role,
        updatedAt,
        userId,
        ...profile,
      },
      message: 'Retrieved user and profile successfully',
      status: 'success',
    });
  };

export const loginWithGoogleCallbackController: LoginWithGoogleCallbackController = async (req, res, _next) => {
  const { user } = req;
  const { token } = user as IUser;

  res.cookie('jwt', token, cookieOptions);

  return res.redirect(process.env.FRONTEND_URL!);
};

export const logoutController: LogoutController = async (req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie('jwt', cookieOptions);

  return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
    message: 'User log out successfully',
    status: 'success',
  });
};

export const forgotPasswordController: ForgotPasswordController =
  ({ forgotPasswordService }) =>
  async (req, res, _next) => {
    await forgotPasswordService({ req });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      message: 'Reset password link was sent to the user email',
      status: 'success',
    });
  };

export const resetPasswordController: ResetPasswordController =
  ({ resetPasswordService, setTokenCookieAndSendResponse }) =>
  async (req, res, _next) => {
    const { token: resetToken } = req.params;

    const { error, value } = resetPasswordSchema.validate({ resetToken, ...req.body });

    if (error) {
      throw new AppError(error.message, HTTP_STATUS_CODES.BAD_REQUEST_400);
    }

    const token = await resetPasswordService(value);

    return setTokenCookieAndSendResponse(res, {
      message: 'Password has been changed',
      statusCode: HTTP_STATUS_CODES.SUCCESS_200,
      token,
    });
  };

export const changeMyPasswordController: ChangeMyPasswordController =
  ({ changeMyPasswordService, setTokenCookieAndSendResponse }) =>
  async (req, res, _next) => {
    const token = await changeMyPasswordService({ ...req.body, user: req.user });

    return setTokenCookieAndSendResponse(res, {
      message: 'Password has been changed',
      statusCode: HTTP_STATUS_CODES.SUCCESS_200,
      token,
    });
  };

export const deleteMeController: DeleteMeController =
  ({ deleteMeService }) =>
  async (req, res, _next) => {
    await deleteMeService({ ...req.body, user: req.user });

    return res.status(HTTP_STATUS_CODES.NO_CONTENT_204).end();
  };

export const verifyEmailcontroller: VerifyEmailcontroller =
  ({ verifyEmailService }) =>
  async (req: Request, res: Response, _next: NextFunction) => {
    const { token } = req.params;
    await verifyEmailService({ token });

    return res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      message: 'Email validated successfully',
      status: 'success',
    });
  };
