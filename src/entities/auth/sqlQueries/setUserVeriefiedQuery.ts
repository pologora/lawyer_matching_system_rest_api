export const setUserVerifiedQuery = `
UPDATE User
SET active = true, emailVerificationToken = null, emailVerificationTokenExpiration = null
WHERE userId = ?
`;
