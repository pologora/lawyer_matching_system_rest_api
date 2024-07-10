export interface SetResetPasswordToken {
  hashedToken: string;
  expirationInMinutes: number;
  userId: number;
}
