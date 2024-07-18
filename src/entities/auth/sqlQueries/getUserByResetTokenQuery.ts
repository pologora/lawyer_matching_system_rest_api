export const getUserByResetTokenQuery = `
SELECT *
FROM User
WHERE resetPasswordToken = ?
`;
