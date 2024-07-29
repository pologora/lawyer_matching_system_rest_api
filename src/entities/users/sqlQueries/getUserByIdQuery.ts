export const getUserByIdQuery = `
SELECT userId, email, role, createdAt, updatedAt, active, googleId 
FROM User where userId = ?;
`;
