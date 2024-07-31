export const registerByGoogleQuery = `
INSERT INTO User (active, email, googleId)
VALUES (true, ?, ?);
`;
