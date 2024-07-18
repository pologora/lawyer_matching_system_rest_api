export const getUserByEmailQuery = `
SELECT * 
FROM User 
WHERE email = ?;
`;
