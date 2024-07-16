export const clearResetPasswordQuery = `
UPDATE users
SET reset_password_token = null,
reset_password_token_expiration = null
WHERE id = ?;
`;
