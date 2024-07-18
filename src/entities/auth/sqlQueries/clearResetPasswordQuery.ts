export const clearResetPasswordQuery = `
UPDATE User
SET resetPasswordToken = null,
resetPasswordTokenExpiration = null
WHERE userId = ?;
`;
