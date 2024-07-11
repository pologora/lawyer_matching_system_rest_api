export interface ResetPasswordDto {
  resetToken: string;
  password: string;
  confirmPassword: string;
}
