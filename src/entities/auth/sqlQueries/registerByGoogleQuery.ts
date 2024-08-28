export const registerByGoogleQuery = `
INSERT INTO User (isVerified, email, googleId)
VALUES (true, ?, ?);
`;
