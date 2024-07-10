export const getUserByEmailQuery = `
SELECT * 
FROM users 
WHERE email = ?;
`;
