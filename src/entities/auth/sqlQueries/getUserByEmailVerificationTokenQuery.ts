export const getUserByEmailVerificationTokenQuery = `
SELECT emailVerificationToken, emailVerificationTokenExpiration, userId
FROM User
WHERE emailVerificationToken = ?
`;
