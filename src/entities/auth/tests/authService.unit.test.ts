/* eslint-disable sort-keys */
/* eslint-disable max-lines-per-function */
import { Request } from 'express';
import { AuthModel } from '../types/authModelTypes';
import {
  changeMyPasswordService,
  deleteMeService,
  forgotPasswordService,
  getMeService,
  loginService,
  registerService,
  resetPasswordService,
  verifyEmailService,
} from '../authService';
import { Email } from '../../../core/email/Email';
import { LawyerModel } from '../../lawyers/types/lawyersTypes';
import { ClientModel } from '../../clients/types/clientTypes';
import { IUser } from '../../../types/IUser';

describe('authService', () => {
  let req: Request;
  let mockCreateHashedToken: jest.Mock;
  let mockCreateRandomToken: jest.Mock;
  let mockCreateJWT: jest.Mock;
  let mockHashPassword: jest.Mock;
  let mockCalculateEmailVerificationExpiraton: jest.Mock;
  let mockRegisterByEmail: jest.Mock;
  let mockSendWellcomeEmailRegistration: jest.Mock;
  let mockReqGet: jest.Mock;
  let mockLogin: jest.Mock;
  let mockComparePasswords: jest.Mock;
  let mockGetOne: jest.Mock;
  let mockGetUserByEmail: jest.Mock;
  let mockSendResetPassword: jest.Mock;
  let mockClearResetPassword: jest.Mock;
  let mockSetResetPasswordToken: jest.Mock;
  let mockGetUserByResetToken: jest.Mock;
  let mockIsTokenExpired: jest.Mock;
  let mockUpdatePassword: jest.Mock;
  let mockDeleteMe: jest.Mock;
  let mockSetUserVerified: jest.Mock;
  let mockGetUserByEmailVerificationToken: jest.Mock;

  let mockAuth: Partial<AuthModel>;
  let mockEmail: Partial<Email>;
  let mockLawyer: Partial<LawyerModel>;
  let mockClient: Partial<ClientModel>;

  const mockQuery = 'Query';
  const mockJWT = 'JWT Token';
  const mockNewId = 1;
  const mockEmailTokenExpiration = 100;
  const mockEmailValidationToken = 'email token';
  const mockRandomToken = 'random token';
  const mockHashedPassword = 'hashedpassword123';
  const mockBody = { email: 'mail@mail.com', password: 'password123' };
  const mockRole = 'admin';
  const mockUser = {
    userId: mockNewId,
    email: mockBody.email,
    role: mockRole,
    password: mockHashedPassword,
    resetPasswordTokenExpiration: mockEmailTokenExpiration,
    emailVerificationTokenExpiration: mockEmailTokenExpiration,
  };
  const mockHashedToken = 'hashed token';
  const mockToken = 'mock token';

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateHashedToken = jest.fn();
    mockCreateRandomToken = jest.fn();
    mockCreateJWT = jest.fn();
    mockHashPassword = jest.fn();
    mockCalculateEmailVerificationExpiraton = jest.fn();
    mockRegisterByEmail = jest.fn();
    mockSendWellcomeEmailRegistration = jest.fn();
    mockReqGet = jest.fn();
    mockLogin = jest.fn();
    mockComparePasswords = jest.fn();
    mockGetOne = jest.fn();
    mockGetUserByEmail = jest.fn();
    mockSendResetPassword = jest.fn();
    mockClearResetPassword = jest.fn();
    mockSetResetPasswordToken = jest.fn();
    mockGetUserByResetToken = jest.fn();
    mockIsTokenExpired = jest.fn();
    mockUpdatePassword = jest.fn();
    mockDeleteMe = jest.fn();
    mockSetUserVerified = jest.fn();
    mockGetUserByEmailVerificationToken = jest.fn();

    mockAuth = {
      registerByEmail: mockRegisterByEmail,
      login: mockLogin,
      getUserByEmail: mockGetUserByEmail,
      clearResetPassword: mockClearResetPassword,
      setResetPasswordToken: mockSetResetPasswordToken,
      getUserByResetToken: mockGetUserByResetToken,
      updatePassword: mockUpdatePassword,
      deleteMe: mockDeleteMe,
      setUserVerified: mockSetUserVerified,
      getUserByEmailVerificationToken: mockGetUserByEmailVerificationToken,
    };

    mockEmail = jest.fn().mockImplementation(() => {
      return {
        sendWellcomeEmailRegistration: mockSendWellcomeEmailRegistration,
        sendResetPassword: mockSendResetPassword,
      };
    });

    mockLawyer = { getOneByUserId: mockGetOne };

    mockClient = { getOneByUserId: mockGetOne };

    req = {
      body: mockBody,
      params: {},
      user: {},
      protocol: 'protocol',
      get: mockReqGet,
    } as unknown as Request;
  });
  describe('registerService', () => {
    it('should register new user, send validation email and return a jwt token', async () => {
      mockHashPassword.mockReturnValue(mockHashedPassword);
      mockCreateRandomToken.mockReturnValue(mockRandomToken);
      mockCreateHashedToken.mockReturnValue(mockEmailValidationToken);
      mockCalculateEmailVerificationExpiraton.mockReturnValue(mockEmailTokenExpiration);
      mockRegisterByEmail.mockResolvedValue({ insertId: mockNewId });
      mockReqGet.mockReturnValue('host');
      mockSendWellcomeEmailRegistration(undefined);
      mockCreateJWT.mockReturnValue(mockJWT);

      const middleware = registerService({
        Auth: mockAuth as unknown as AuthModel,
        calculateEmailVerificationExpiraton: mockCalculateEmailVerificationExpiraton,
        createHashedToken: mockCreateHashedToken,
        createJWT: mockCreateJWT,
        createRandomToken: mockCreateRandomToken,
        Email: mockEmail as unknown as typeof Email,
        hashPassword: mockHashPassword,
        registerByEmailQuery: mockQuery,
      });

      const result = await middleware({ req });

      expect(mockHashPassword).toHaveBeenCalledWith(mockBody.password);
      expect(mockCreateRandomToken).toHaveBeenCalledTimes(1);
      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockRandomToken);
      expect(mockCalculateEmailVerificationExpiraton).toHaveBeenCalledTimes(1);
      expect(mockRegisterByEmail).toHaveBeenCalledWith({
        email: mockBody.email,
        emailVerificationTokenExpiration: mockEmailTokenExpiration,
        hashedEmailValidationToken: mockEmailValidationToken,
        password: mockHashedPassword,
        registerByEmailQuery: mockQuery,
      });
      expect(mockReqGet).toHaveBeenCalled();
      expect(mockSendWellcomeEmailRegistration).toHaveBeenCalled();
      expect(mockCreateJWT).toHaveBeenCalledWith({ id: mockNewId });
      expect(result).toBe(mockJWT);
    });
  });

  describe('loginService', () => {
    it('should validate user with email and password and return a jwt token', async () => {
      mockLogin.mockResolvedValue(mockUser);
      mockComparePasswords.mockReturnValue(true);
      mockCreateJWT.mockReturnValue(mockJWT);

      const middleware = loginService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        loginUserQuery: mockQuery,
      });

      const result = await middleware({ email: mockBody.email, password: mockBody.password });

      expect(mockLogin).toHaveBeenCalledWith({
        email: mockBody.email,
        loginUserQuery: mockQuery,
      });
      expect(mockComparePasswords).toHaveBeenCalledWith(mockBody.password, mockHashedPassword);
      expect(mockCreateJWT).toHaveBeenCalledWith({ id: mockNewId });
      expect(result).toEqual({ token: mockJWT, user: { email: mockBody.email, role: mockRole, userId: mockNewId } });
    });

    it('should throw if password is not valid', async () => {
      mockLogin.mockResolvedValue(mockUser);
      mockComparePasswords.mockReturnValue(false);

      const middleware = loginService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        loginUserQuery: mockQuery,
      });

      await expect(
        async () => await middleware({ email: mockBody.email, password: mockBody.password }),
      ).rejects.toThrow('Email or password is not valid');

      expect(mockLogin).toHaveBeenCalledWith({
        email: mockBody.email,
        loginUserQuery: mockQuery,
      });
      expect(mockComparePasswords).toHaveBeenCalledWith(mockBody.password, mockHashedPassword);
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });

    it('should throw if no user is found', async () => {
      mockLogin.mockResolvedValue(null);

      const middleware = loginService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        loginUserQuery: mockQuery,
      });

      await expect(
        async () => await middleware({ email: mockBody.email, password: mockBody.password }),
      ).rejects.toThrow('Email or password is not valid');

      expect(mockLogin).toHaveBeenCalledWith({
        email: mockBody.email,
        loginUserQuery: mockQuery,
      });
      expect(mockComparePasswords).not.toHaveBeenCalled();
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });
  });

  describe('getMeService', () => {
    it('should return client if user role is client', async () => {
      const clientData = { role: 'client', userId: 1 };
      mockGetOne.mockResolvedValue(clientData);

      const middleware = getMeService({
        Client: mockClient as unknown as ClientModel,
        getLawyerByUserIdQuery: mockQuery,
        getOneClientByUserIdQuery: mockQuery,
        Lawyer: mockLawyer as unknown as LawyerModel,
      });

      const result = await middleware({ role: 'client', userId: 1 });

      expect(result).toEqual(clientData);
    });

    it('should return lawyer if user role is lawyer', async () => {
      const clientData = { role: 'lawyer', userId: 1 };
      mockGetOne.mockResolvedValue(clientData);

      const middleware = getMeService({
        Client: mockClient as unknown as ClientModel,
        getLawyerByUserIdQuery: mockQuery,
        getOneClientByUserIdQuery: mockQuery,
        Lawyer: mockLawyer as unknown as LawyerModel,
      });

      const result = await middleware({ role: 'lawyer', userId: 1 });

      expect(result).toEqual(clientData);
    });

    it('should return null if role is neither lawyer no client', async () => {
      const clientData = { role: 'user', userId: 1 };
      mockGetOne.mockResolvedValue(clientData);

      const middleware = getMeService({
        Client: mockClient as unknown as ClientModel,
        getLawyerByUserIdQuery: mockQuery,
        getOneClientByUserIdQuery: mockQuery,
        Lawyer: mockLawyer as unknown as LawyerModel,
      });

      const result = await middleware({ role: 'user', userId: 1 });

      expect(result).toEqual(null);
    });
  });

  describe('forgotPasswordService', () => {
    it('should find user by email and send an email with a reset password token', async () => {
      const resetToken = 'reset token';

      mockGetUserByEmail.mockReturnValue(mockUser);
      mockCreateRandomToken.mockReturnValue(mockRandomToken);
      mockCreateHashedToken.mockReturnValue(resetToken);
      mockSetResetPasswordToken.mockReturnValue(undefined);
      mockReqGet.mockReturnValue('host');
      mockSendResetPassword.mockReturnValue(undefined);
      mockClearResetPassword.mockReturnValue(undefined);

      const middleware = forgotPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        clearResetPasswordQuery: mockQuery,
        createHashedToken: mockCreateHashedToken,
        createRandomToken: mockCreateRandomToken,
        Email: mockEmail as unknown as typeof Email,
        getUserByEmailQuery: mockQuery,
        setResetPasswordTokenQuery: mockQuery,
        tokenExpirationInMinutes: mockEmailTokenExpiration,
      });

      await middleware({ req });

      expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: mockBody.email, getUserByEmailQuery: mockQuery });
      expect(mockCreateRandomToken).toHaveBeenCalled();
      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockRandomToken);
      expect(mockSetResetPasswordToken).toHaveBeenCalledWith({
        expirationInMinutes: mockEmailTokenExpiration,
        hashedToken: resetToken,
        setResetPasswordTokenQuery: mockQuery,
        userId: mockUser.userId,
      });
      expect(mockReqGet).toHaveBeenCalledTimes(1);
      expect(mockSendResetPassword).toHaveBeenCalled();
      expect(mockClearResetPassword).not.toHaveBeenCalled();
    });

    it('should throw is no user found by email', async () => {
      mockGetUserByEmail.mockReturnValue(null);

      const middleware = forgotPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        clearResetPasswordQuery: mockQuery,
        createHashedToken: mockCreateHashedToken,
        createRandomToken: mockCreateRandomToken,
        Email: mockEmail as unknown as typeof Email,
        getUserByEmailQuery: mockQuery,
        setResetPasswordTokenQuery: mockQuery,
        tokenExpirationInMinutes: mockEmailTokenExpiration,
      });

      await expect(async () => {
        await middleware({ req });
      }).rejects.toThrow('There is no user with this email adress');
      expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: mockBody.email, getUserByEmailQuery: mockQuery });
      expect(mockCreateRandomToken).not.toHaveBeenCalled();
      expect(mockCreateHashedToken).not.toHaveBeenCalled();
      expect(mockSetResetPasswordToken).not.toHaveBeenCalled();
      expect(mockReqGet).not.toHaveBeenCalled();
      expect(mockSendResetPassword).not.toHaveBeenCalled();
      expect(mockClearResetPassword).not.toHaveBeenCalled();
    });

    it('should clear reset password user data and throw if email sending service fail', async () => {
      const resetToken = 'reset token';

      mockGetUserByEmail.mockReturnValue(mockUser);
      mockCreateRandomToken.mockReturnValue(mockRandomToken);
      mockCreateHashedToken.mockReturnValue(resetToken);
      mockSetResetPasswordToken.mockReturnValue(undefined);
      mockReqGet.mockReturnValue('host');
      mockSendResetPassword.mockImplementation(() => {
        throw new Error('Error');
      });
      mockClearResetPassword.mockReturnValue(undefined);

      const middleware = forgotPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        clearResetPasswordQuery: mockQuery,
        createHashedToken: mockCreateHashedToken,
        createRandomToken: mockCreateRandomToken,
        Email: mockEmail as unknown as typeof Email,
        getUserByEmailQuery: mockQuery,
        setResetPasswordTokenQuery: mockQuery,
        tokenExpirationInMinutes: mockEmailTokenExpiration,
      });

      await expect(async () => {
        await middleware({ req });
      }).rejects.toThrow('There was an error sending the email. Please, try again later');

      expect(mockGetUserByEmail).toHaveBeenCalledWith({ email: mockBody.email, getUserByEmailQuery: mockQuery });
      expect(mockCreateRandomToken).toHaveBeenCalled();
      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockRandomToken);
      expect(mockSetResetPasswordToken).toHaveBeenCalledWith({
        expirationInMinutes: mockEmailTokenExpiration,
        hashedToken: resetToken,
        setResetPasswordTokenQuery: mockQuery,
        userId: mockUser.userId,
      });
      expect(mockReqGet).toHaveBeenCalledTimes(1);
      expect(mockSendResetPassword).toHaveBeenCalled();
      expect(mockClearResetPassword).toHaveBeenCalledWith({ clearResetPasswordQuery: mockQuery, id: mockUser.userId });
    });
  });

  describe('resetPasswordService', () => {
    const mockNewPassword = 'new password';
    it('should reset the password and return a JWT', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByResetToken.mockResolvedValue(mockUser);
      mockIsTokenExpired.mockReturnValue(false);
      mockHashPassword.mockResolvedValue(mockHashedPassword);
      mockUpdatePassword.mockResolvedValue(true);
      mockCreateJWT.mockResolvedValue(mockJWT);

      const middleware = resetPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        isTokenExpired: mockIsTokenExpired,
        getUserByResetTokenQuery: 'query',
        updateUserPasswordQuery: 'query',
      });

      const result = await middleware({
        resetToken: mockToken,
        password: mockNewPassword,
        confirmPassword: mockNewPassword,
      });

      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockToken);
      expect(mockGetUserByResetToken).toHaveBeenCalledWith({
        getUserByResetTokenQuery: 'query',
        hashedToken: mockHashedToken,
      });
      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockUser.resetPasswordTokenExpiration);
      expect(mockHashPassword).toHaveBeenCalledWith(mockNewPassword);
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        id: mockUser.userId,
        password: mockHashedPassword,
        updateUserPasswordQuery: 'query',
      });
      expect(mockCreateJWT).toHaveBeenCalledWith({ id: mockUser.userId });
      expect(result).toBe(mockJWT);
    });

    it('should throw if no user is found by reset token', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByResetToken.mockResolvedValue(null);

      const middleware = resetPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        isTokenExpired: mockIsTokenExpired,
        getUserByResetTokenQuery: 'query',
        updateUserPasswordQuery: 'query',
      });

      await expect(
        middleware({ resetToken: mockToken, password: mockNewPassword, confirmPassword: mockNewPassword }),
      ).rejects.toThrow('Invalid reset password token');

      expect(mockGetUserByResetToken).toHaveBeenCalledWith({
        getUserByResetTokenQuery: 'query',
        hashedToken: mockHashedToken,
      });
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });

    it('should throw if reset token is expired', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByResetToken.mockResolvedValue(mockUser);
      mockIsTokenExpired.mockReturnValue(true);

      const middleware = resetPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        isTokenExpired: mockIsTokenExpired,
        getUserByResetTokenQuery: 'query',
        updateUserPasswordQuery: 'query',
      });

      await expect(
        middleware({ resetToken: mockToken, password: mockNewPassword, confirmPassword: mockNewPassword }),
      ).rejects.toThrow('The time limit for changing the password has expired. Please try again');

      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockUser.resetPasswordTokenExpiration);
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });

    it('should throw if password update fails', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByResetToken.mockResolvedValue(mockUser);
      mockIsTokenExpired.mockReturnValue(false);
      mockHashPassword.mockResolvedValue(mockHashedPassword);
      mockUpdatePassword.mockResolvedValue(false);

      const middleware = resetPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        isTokenExpired: mockIsTokenExpired,
        getUserByResetTokenQuery: 'query',
        updateUserPasswordQuery: 'query',
      });

      await expect(
        middleware({ resetToken: mockToken, password: mockNewPassword, confirmPassword: mockNewPassword }),
      ).rejects.toThrow('Password update failed. Please try again later');

      expect(mockUpdatePassword).toHaveBeenCalledWith({
        id: mockUser.userId,
        password: mockHashedPassword,
        updateUserPasswordQuery: 'query',
      });
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });
  });

  describe('changeMyPasswordService', () => {
    const mockNewPassword = 'new password';
    it('should change the user password and return a JWT', async () => {
      mockComparePasswords.mockResolvedValue(true);
      mockHashPassword.mockResolvedValue(mockHashedPassword);
      mockUpdatePassword.mockResolvedValue(true);
      mockCreateJWT.mockResolvedValue(mockJWT);

      const middleware = changeMyPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        updateUserPasswordQuery: 'query',
      });

      const result = await middleware({
        password: mockNewPassword,
        newPassword: mockNewPassword,
        user: mockUser as unknown as IUser,
      });

      expect(mockComparePasswords).toHaveBeenCalledWith(mockNewPassword, mockUser.password);
      expect(mockHashPassword).toHaveBeenCalledWith(mockNewPassword);
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        id: mockUser.userId,
        password: mockHashedPassword,
        updateUserPasswordQuery: 'query',
      });
      expect(mockCreateJWT).toHaveBeenCalledWith({ id: mockUser.userId });
      expect(result).toBe(mockJWT);
    });

    it('should throw if the current password is invalid', async () => {
      mockComparePasswords.mockResolvedValue(false);

      const middleware = changeMyPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        updateUserPasswordQuery: 'query',
      });

      await expect(
        middleware({
          password: mockNewPassword,
          newPassword: mockNewPassword,
          user: mockUser as unknown as IUser,
        }),
      ).rejects.toThrow('Invalid  password');

      expect(mockComparePasswords).toHaveBeenCalledWith(mockNewPassword, mockUser.password);
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });

    it('should throw if password update fails', async () => {
      mockComparePasswords.mockResolvedValue(true);
      mockHashPassword.mockResolvedValue(mockHashedPassword);
      mockUpdatePassword.mockResolvedValue(false);

      const middleware = changeMyPasswordService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        createJWT: mockCreateJWT,
        hashPassword: mockHashPassword,
        updateUserPasswordQuery: 'query',
      });

      await expect(
        middleware({
          password: mockNewPassword,
          newPassword: mockNewPassword,
          user: mockUser as unknown as IUser,
        }),
      ).rejects.toThrow('Password update failed. Please try again later');

      expect(mockUpdatePassword).toHaveBeenCalledWith({
        id: mockUser.userId,
        password: mockHashedPassword,
        updateUserPasswordQuery: 'query',
      });
      expect(mockCreateJWT).not.toHaveBeenCalled();
    });
  });

  describe('deleteMeService', () => {
    const mockPassword = mockUser.password;
    it('should delete the user account if password is valid', async () => {
      mockComparePasswords.mockResolvedValue(true);
      mockDeleteMe.mockResolvedValue(true);

      const middleware = deleteMeService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        deleteMeQuery: 'query',
      });

      await middleware({ password: mockPassword, user: mockUser as unknown as IUser });

      expect(mockComparePasswords).toHaveBeenCalledWith(mockPassword, mockUser.password);
      expect(mockDeleteMe).toHaveBeenCalledWith({ deleteMeQuery: 'query', id: mockUser.userId });
    });

    it('should throw an error if the password is invalid', async () => {
      mockComparePasswords.mockResolvedValue(false);

      const middleware = deleteMeService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        deleteMeQuery: 'query',
      });

      await expect(middleware({ password: mockPassword, user: mockUser as unknown as IUser })).rejects.toThrow(
        'Invalid  password',
      );

      expect(mockComparePasswords).toHaveBeenCalledWith(mockPassword, mockUser.password);
      expect(mockDeleteMe).not.toHaveBeenCalled();
    });

    it('should throw an error if account deletion fails', async () => {
      mockComparePasswords.mockResolvedValue(true);
      mockDeleteMe.mockResolvedValue(false);

      const middleware = deleteMeService({
        Auth: mockAuth as unknown as AuthModel,
        comparePasswords: mockComparePasswords,
        deleteMeQuery: 'query',
      });

      await expect(middleware({ password: mockPassword, user: mockUser as unknown as IUser })).rejects.toThrow(
        'Failed to delete an account. Please try again later',
      );

      expect(mockComparePasswords).toHaveBeenCalledWith(mockPassword, mockUser.password);
      expect(mockDeleteMe).toHaveBeenCalledWith({ deleteMeQuery: 'query', id: mockUser.userId });
    });
  });

  describe('verifyEmailService', () => {
    it('should verify email if token is valid and not expired', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByEmailVerificationToken.mockResolvedValue(mockUser);
      mockIsTokenExpired.mockReturnValue(false);
      mockSetUserVerified.mockResolvedValue(true);

      const middleware = verifyEmailService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        isTokenExpired: mockIsTokenExpired,
        getUserByEmailVerificationTokenQuery: 'query',
        setUserVerifiedQuery: 'query',
      });

      const result = await middleware({ token: mockToken });

      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockToken);
      expect(mockGetUserByEmailVerificationToken).toHaveBeenCalledWith({
        getUserByEmailVerificationTokenQuery: 'query',
        hashedToken: mockHashedToken,
      });
      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockUser.emailVerificationTokenExpiration);
      expect(mockSetUserVerified).toHaveBeenCalledWith({ id: mockUser.userId, setUserVerifiedQuery: 'query' });
      expect(result).toBe(true);
    });

    it('should throw an error if the email verification token is invalid', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByEmailVerificationToken.mockResolvedValue(null);

      const middleware = verifyEmailService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        isTokenExpired: mockIsTokenExpired,
        getUserByEmailVerificationTokenQuery: 'query',
        setUserVerifiedQuery: 'query',
      });

      await expect(middleware({ token: mockToken })).rejects.toThrow('Invalid email verification token');

      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockToken);
      expect(mockGetUserByEmailVerificationToken).toHaveBeenCalledWith({
        getUserByEmailVerificationTokenQuery: 'query',
        hashedToken: mockHashedToken,
      });
      expect(mockIsTokenExpired).not.toHaveBeenCalled();
      expect(mockSetUserVerified).not.toHaveBeenCalled();
    });

    it('should throw an error if the email verification token is expired', async () => {
      mockCreateHashedToken.mockReturnValue(mockHashedToken);
      mockGetUserByEmailVerificationToken.mockResolvedValue(mockUser);
      mockIsTokenExpired.mockReturnValue(true);

      const middleware = verifyEmailService({
        Auth: mockAuth as unknown as AuthModel,
        createHashedToken: mockCreateHashedToken,
        isTokenExpired: mockIsTokenExpired,
        getUserByEmailVerificationTokenQuery: 'query',
        setUserVerifiedQuery: 'query',
      });

      await expect(middleware({ token: mockToken })).rejects.toThrow(
        'The time limit for email verification expired. Please register again',
      );

      expect(mockCreateHashedToken).toHaveBeenCalledWith(mockToken);
      expect(mockGetUserByEmailVerificationToken).toHaveBeenCalledWith({
        getUserByEmailVerificationTokenQuery: 'query',
        hashedToken: mockHashedToken,
      });
      expect(mockIsTokenExpired).toHaveBeenCalledWith(mockUser.emailVerificationTokenExpiration);
      expect(mockSetUserVerified).not.toHaveBeenCalled();
    });
  });
});
