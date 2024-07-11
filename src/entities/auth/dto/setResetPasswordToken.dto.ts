export interface SetResetPasswordTokenDto {
  hashedToken: string;
  expirationInMinutes: number;
  userId: number;
}
