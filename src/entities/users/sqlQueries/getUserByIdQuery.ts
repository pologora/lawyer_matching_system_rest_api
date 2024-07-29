export const getUserByIdQuery = `
SELECT userId, email, role, createdAt, updatedAt, active 
FROM User where userId = ?;
`;
