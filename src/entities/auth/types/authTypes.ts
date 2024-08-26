export type LoginProps = {
  email: string;
};

export type RegisterByEmailProps = {
  email: string;
  password: string;
  emailVerificationTokenExpiration: Date;
  hashedEmailValidationToken: string;
};

export type RegisterByGoogle = {
  email: string;
  googleId: string;
};

export type GetUserByEmailProps = {
  email: string;
};

export type SetResetPasswordTokenProps = {
  hashedToken: string;
  expirationInMinutes: number;
  userId: number;
};

export type ClearResetPasswordProps = {
  id: number;
};

export type UpdatePasswordProps = {
  password: string;
  id: number;
};

export type GetUserByResetTokenProps = {
  hashedToken: string;
};

export type GetUserByEmailVerificationTokenProps = {
  hashedToken: string;
};

export type DeleteMeProps = {
  id: number;
};
