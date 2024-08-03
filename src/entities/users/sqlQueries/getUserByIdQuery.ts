const dev = `
SELECT *
FROM User where userId = ?;
`;

const prod = `
SELECT userId, email, role, createdAt, updatedAt, active, googleId, passwordChangedAt
FROM User where userId = ?;
`;

export const getUserByIdQuery = process.env.NODE_ENV === 'production' ? prod : dev;
