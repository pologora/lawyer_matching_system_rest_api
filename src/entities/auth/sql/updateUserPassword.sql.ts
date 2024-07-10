export const updateUserPasswordQuery = `
UPDATE users
SET password = ?,
    reset_password_token = null, 
    reset_password_token_expiration = null,
    password_changed_at = CURRENT_TIMESTAMP()
WHERE id = ?
`;
