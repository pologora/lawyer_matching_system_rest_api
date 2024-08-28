export const getUserByEmailQuery = `
SELECT userId, email, role, createdAt, updatedAt, isVerified, googleId
FROM User 
WHERE email = ?;
`;
