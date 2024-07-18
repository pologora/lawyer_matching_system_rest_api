export const setResetPasswordTokenQuery = `
UPDATE User
SET resetPasswordToken = ?,
resetPasswordTokenExpiration = DATE_ADD(NOW(), INTERVAL ? MINUTE)
WHERE userId = ?;
`;
