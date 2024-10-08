import { HTTP_STATUS_CODES } from '../../config/statusCodes';
import { AppError } from '../../core/AppError';
import {
  ChangeMyPasswordService,
  DeleteMeService,
  ForgotPasswordService,
  GetMeService,
  LoginService,
  RegisterService,
  ResetPasswordService,
  VerifyEmailService,
} from './types/authServiceTypes';

export const registerService: RegisterService =
  ({
    Auth,
    Email,
    calculateEmailVerificationExpiraton,
    createHashedToken,
    createJWT,
    createRandomToken,
    hashPassword,
    registerByEmailQuery,
  }) =>
  async ({ req }) => {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const emailValidationToken = createRandomToken();
    const hashedEmailValidationToken = createHashedToken(emailValidationToken);

    const emailVerificationTokenExpiration = calculateEmailVerificationExpiraton();

    const { insertId } = await Auth.registerByEmail({
      email,
      emailVerificationTokenExpiration,
      hashedEmailValidationToken,
      password: hashedPassword,
      registerByEmailQuery,
    });

    const url = `${req.protocol}://${req.get('host')}/api/v1/auth/email-verification/${emailValidationToken}`;
    await new Email({ url, user: { email } }).sendWellcomeEmailRegistration();

    const token = await createJWT({ id: insertId });

    return token;
  };

export const loginService: LoginService =
  ({ Auth, comparePasswords, createJWT, loginUserQuery }) =>
  async ({ email: inputEmail, password: candidatePassword }) => {
    // 1) check user with email exists and password is valid
    const user = await Auth.login({ email: inputEmail, loginUserQuery });

    if (!user || !(await comparePasswords(candidatePassword, user.password))) {
      throw new AppError('Email or password is not valid', HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    // 2) create token, return user  + token
    const { userId, email, role } = user;
    const token = await createJWT({ id: userId });

    return { token, user: { email, role, userId } };
  };

export const getMeService: GetMeService =
  ({ Client: ClientProfile, Lawyer: LawyerProfile, getOneClientByUserIdQuery, getLawyerByUserIdQuery }) =>
  async ({ role, userId }) => {
    return role === 'client'
      ? await ClientProfile.getOneByUserId({ query: getOneClientByUserIdQuery, userId })
      : role === 'lawyer'
      ? await LawyerProfile.getOneByUserId({ getLawyerByUserIdQuery, userId })
      : null;
  };

export const forgotPasswordService: ForgotPasswordService =
  ({
    Auth,
    Email,
    clearResetPasswordQuery,
    createHashedToken,
    createRandomToken,
    getUserByEmailQuery,
    setResetPasswordTokenQuery,
    tokenExpirationInMinutes,
  }) =>
  async ({ req }) => {
    const { email } = req.body;
    const user = await Auth.getUserByEmail({ email, getUserByEmailQuery });

    if (!user) {
      throw new AppError('There is no user with this email adress', HTTP_STATUS_CODES.NOT_FOUND_404);
    }

    const resetToken = createRandomToken();
    const hashedToken = createHashedToken(resetToken);

    await Auth.setResetPasswordToken({
      expirationInMinutes: tokenExpirationInMinutes,
      hashedToken,
      setResetPasswordTokenQuery,
      userId: user.userId,
    });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    try {
      await new Email({ url: resetPasswordUrl, user }).sendResetPassword();
    } catch (err) {
      await Auth.clearResetPassword({ clearResetPasswordQuery, id: user.userId });
      throw new AppError(
        'There was an error sending the email. Please, try again later',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
      );
    }
  };

export const resetPasswordService: ResetPasswordService =
  ({
    Auth,
    createHashedToken,
    createJWT,
    hashPassword,
    isTokenExpired,
    getUserByResetTokenQuery,
    updateUserPasswordQuery,
  }) =>
  async ({ resetToken, password }) => {
    const hashedToken = createHashedToken(resetToken);
    //get user by token
    const user = await Auth.getUserByResetToken({ getUserByResetTokenQuery, hashedToken });
    if (!user) {
      throw new AppError('Invalid reset password token', HTTP_STATUS_CODES.BAD_REQUEST_400);
    }

    // check if token not expired
    const isResetTokenExpired = isTokenExpired(user.resetPasswordTokenExpiration!);
    if (isResetTokenExpired) {
      throw new AppError('The time limit for changing the password has expired. Please try again');
    }

    //3. update changePasswordAt, and set new pass
    const hashedPassword = await hashPassword(password);
    const result = await Auth.updatePassword({ id: user.userId, password: hashedPassword, updateUserPasswordQuery });
    if (!result) {
      throw new AppError('Password update failed. Please try again later', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }

    //4. send jwt
    return await createJWT({ id: user.userId });
  };

export const changeMyPasswordService: ChangeMyPasswordService =
  ({ Auth, comparePasswords, createJWT, hashPassword, updateUserPasswordQuery }) =>
  async ({ password, newPassword, user }) => {
    const validPassword = await comparePasswords(password, user.password!);
    if (!validPassword) {
      throw new AppError('Invalid  password', HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    const hashedPassword = await hashPassword(newPassword);
    const result = await Auth.updatePassword({ id: user.userId, password: hashedPassword, updateUserPasswordQuery });
    if (!result) {
      throw new AppError('Password update failed. Please try again later', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    }

    return await createJWT({ id: user.userId });
  };

export const deleteMeService: DeleteMeService =
  ({ Auth, comparePasswords, deleteMeQuery }) =>
  async ({ password, user }) => {
    const validPassword = await comparePasswords(password, user.password!);
    if (!validPassword) {
      throw new AppError('Invalid  password', HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    const result = await Auth.deleteMe({ deleteMeQuery, id: user.userId });
    if (!result) {
      throw new AppError(
        'Failed to delete an account. Please try again later',
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
      );
    }
  };

export const verifyEmailService: VerifyEmailService =
  ({ Auth, createHashedToken, isTokenExpired, getUserByEmailVerificationTokenQuery, setUserVerifiedQuery }) =>
  async ({ token }) => {
    const hashedToken = createHashedToken(token);

    const user = await Auth.getUserByEmailVerificationToken({ getUserByEmailVerificationTokenQuery, hashedToken });
    if (!user) {
      throw new AppError('Invalid email verification token', HTTP_STATUS_CODES.BAD_REQUEST_400);
    }

    const isEmailTokenExpired = isTokenExpired(user.emailVerificationTokenExpiration!);
    if (isEmailTokenExpired) {
      throw new AppError(
        'The time limit for email verification expired. Please register again',
        HTTP_STATUS_CODES.BAD_REQUEST_400,
      );
    }

    return await Auth.setUserVerified({ id: user.userId, setUserVerifiedQuery });
  };
