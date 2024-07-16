export const loginUserQuery = `
SELECT *
FROM users
WHERE email = ?;
`;
