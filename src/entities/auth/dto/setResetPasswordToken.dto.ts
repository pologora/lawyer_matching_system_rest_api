export interface SetResetPasswordToken {
  resetToken: string;
  expirationInMinutes: number;
  userId: number;
}
