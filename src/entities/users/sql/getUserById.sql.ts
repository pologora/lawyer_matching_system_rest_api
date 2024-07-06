export const getUserByIdQuery = `
SELECT id, email, role FROM users where id = ?;
`;
