export const getUserByResetTokenQuery = `
SELECT *
FROM users
WHERE reset_password_token = ?
`;
