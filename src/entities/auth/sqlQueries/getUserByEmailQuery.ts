export const getUserByEmailQuery = `
SELECT userId, email, role, createdAt, updatedAt, active, googleId
FROM User 
WHERE email = ?;
`;
