export const setResetPasswordTokenQuery = `
UPDATE users
SET reset_password_token = ?,
reset_password_token_expiration = DATE_ADD(NOW(), INTERVAL ? MINUTE)
WHERE id = ?;
`;
