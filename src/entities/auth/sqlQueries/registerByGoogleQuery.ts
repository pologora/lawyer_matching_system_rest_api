export const registerByGoogleQuery = `
INSERT INTO User (email, googleId)
VALUES (?, ?);
`;
