/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
import { Request, Response, NextFunction } from 'express';
import {
  registerController,
  loginController,
  getMeController,
  loginWithGoogleCallbackController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  changeMyPasswordController,
  deleteMeController,
  verifyEmailcontroller,
} from '../authController';
import { HTTP_STATUS_CODES } from '../../../config/statusCodes';
import { AppError } from '../../../core/AppError';

describe('Auth Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      redirect: jest.fn(),
      end: jest.fn(),
    };

    next = jest.fn();
  });

  describe('registerController', () => {
    it('should register a user and set the token cookie', async () => {
      const mockRegisterService = jest.fn().mockResolvedValue('mockToken');
      const mockSetTokenCookieAndSendResponse = jest.fn();

      await registerController({
        registerService: mockRegisterService,
        setTokenCookieAndSendResponse: mockSetTokenCookieAndSendResponse,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockRegisterService).toHaveBeenCalledWith({ req });
      expect(mockSetTokenCookieAndSendResponse).toHaveBeenCalledWith(res, {
        message: 'User registered successfully',
        statusCode: HTTP_STATUS_CODES.CREATED_201,
        token: 'mockToken',
      });
    });
  });

  describe('loginController', () => {
    it('should log in a user and set the token cookie', async () => {
      const mockLoginService = jest.fn().mockResolvedValue({ token: 'mockToken', user: { id: 1 } });
      const mockSetTokenCookieAndSendResponse = jest.fn();

      req.body = { email: 'test@example.com', password: 'password' };

      await loginController({
        loginService: mockLoginService,
        setTokenCookieAndSendResponse: mockSetTokenCookieAndSendResponse,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockLoginService).toHaveBeenCalledWith(req.body);
      expect(mockSetTokenCookieAndSendResponse).toHaveBeenCalledWith(res, {
        message: 'User login successfully',
        statusCode: HTTP_STATUS_CODES.SUCCESS_200,
        token: 'mockToken',
        user: { id: 1 },
      });
    });
  });

  describe('getMeController', () => {
    it('should return the user profile', async () => {
      const createdAt = new Date();
      const updatedAt = new Date();

      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        googleId: null,
        isVerified: true,
        createdAt,
        updatedAt,
      };

      const mockGetMeService = jest.fn().mockResolvedValue({ profileData: 'data' });

      await getMeController({
        getMeService: mockGetMeService,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockGetMeService).toHaveBeenCalledWith({
        role: 'user',
        userId: 1,
      });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          createdAt: createdAt,
          email: 'test@example.com',
          googleId: null,
          isVerified: true,
          role: 'user',
          updatedAt: updatedAt,
          userId: 1,
          profileData: 'data',
        },
        message: 'Retrieved user and profile successfully',
        status: 'success',
      });
    });
  });

  describe('loginWithGoogleCallbackController', () => {
    it('should set the JWT cookie and redirect to the frontend URL', async () => {
      req.user = { token: 'mockToken' };

      await loginWithGoogleCallbackController(req as Request, res as Response, next as NextFunction);

      expect(res.cookie).toHaveBeenCalledWith('jwt', 'mockToken', expect.any(Object));
      expect(res.redirect).toHaveBeenCalledWith(process.env.FRONTEND_URL!);
    });
  });

  describe('logoutController', () => {
    it('should clear the JWT cookie and respond with a success message', async () => {
      await logoutController(req as Request, res as Response, next as NextFunction);

      expect(res.clearCookie).toHaveBeenCalledWith('jwt', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User log out successfully',
        status: 'success',
      });
    });
  });

  describe('forgotPasswordController', () => {
    it('should trigger forgot password service and respond with a success message', async () => {
      const mockForgotPasswordService = jest.fn().mockResolvedValue(undefined);

      await forgotPasswordController({ forgotPasswordService: mockForgotPasswordService })(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(mockForgotPasswordService).toHaveBeenCalledWith({ req });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Reset password link was sent to the user email',
        status: 'success',
      });
    });
  });

  describe('resetPasswordController', () => {
    it('should reset the user password and set the token cookie', async () => {
      const mockResetPasswordService = jest.fn().mockResolvedValue('newToken');
      const mockSetTokenCookieAndSendResponse = jest.fn();
      req.params = { token: 'resetToken' };
      req.body = { password: 'newPassword', confirmPassword: 'newPassword' };

      await resetPasswordController({
        resetPasswordService: mockResetPasswordService,
        setTokenCookieAndSendResponse: mockSetTokenCookieAndSendResponse,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockResetPasswordService).toHaveBeenCalledWith({
        resetToken: 'resetToken',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      });
      expect(mockSetTokenCookieAndSendResponse).toHaveBeenCalledWith(res, {
        message: 'Password has been changed',
        statusCode: HTTP_STATUS_CODES.SUCCESS_200,
        token: 'newToken',
      });
    });

    it('should throw an error if validation fails', async () => {
      req.params = { token: 'resetToken' };
      req.body = { password: '' };

      await expect(
        resetPasswordController({
          resetPasswordService: jest.fn(),
          setTokenCookieAndSendResponse: jest.fn(),
        })(req as Request, res as Response, next as NextFunction),
      ).rejects.toThrow(AppError);
    });
  });

  describe('changeMyPasswordController', () => {
    it('should change the user password and set the token cookie', async () => {
      const mockChangeMyPasswordService = jest.fn().mockResolvedValue('newToken');
      const mockSetTokenCookieAndSendResponse = jest.fn();

      await changeMyPasswordController({
        changeMyPasswordService: mockChangeMyPasswordService,
        setTokenCookieAndSendResponse: mockSetTokenCookieAndSendResponse,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockChangeMyPasswordService).toHaveBeenCalledWith({
        ...req.body,
        user: req.user,
      });
      expect(mockSetTokenCookieAndSendResponse).toHaveBeenCalledWith(res, {
        message: 'Password has been changed',
        statusCode: HTTP_STATUS_CODES.SUCCESS_200,
        token: 'newToken',
      });
    });
  });

  describe('deleteMeController', () => {
    it('should delete the user and respond with no content', async () => {
      const mockDeleteMeService = jest.fn().mockResolvedValue(undefined);

      await deleteMeController({
        deleteMeService: mockDeleteMeService,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockDeleteMeService).toHaveBeenCalledWith({ ...req.body, user: req.user });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.NO_CONTENT_204);
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('verifyEmailcontroller', () => {
    it('should verify the email and respond with a success message', async () => {
      const mockVerifyEmailService = jest.fn().mockResolvedValue(undefined);
      req.params = { token: 'verificationToken' };

      await verifyEmailcontroller({
        verifyEmailService: mockVerifyEmailService,
      })(req as Request, res as Response, next as NextFunction);

      expect(mockVerifyEmailService).toHaveBeenCalledWith({ token: 'verificationToken' });
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODES.SUCCESS_200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email validated successfully',
        status: 'success',
      });
    });
  });
});
