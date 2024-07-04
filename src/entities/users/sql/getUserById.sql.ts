export const getUserByIdQuery = `
SELECT id, username, email FROM users where id = ?;
`;
