export const setUserVerifiedQuery = `
UPDATE User
SET isVerified = true, emailVerificationToken = null, emailVerificationTokenExpiration = null
WHERE userId = ?
`;
