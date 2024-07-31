export const getUserByIdQuery = `
SELECT userId, email, role, createdAt, updatedAt, active, googleId, passwordChangedAt
FROM User where userId = ?;
`;
