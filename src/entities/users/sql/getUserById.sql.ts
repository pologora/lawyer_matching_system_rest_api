export const getUserByIdQuery = `
SELECT id, email, role, password_changed_at, created_at FROM users where id = ?;
`;
