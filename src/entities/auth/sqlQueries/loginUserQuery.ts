export const loginUserQuery = `
SELECT *
FROM User
WHERE email = ?;
`;
