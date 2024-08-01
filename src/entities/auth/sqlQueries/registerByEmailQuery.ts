export const registerByEmailQuery = `
INSERT INTO User (email, password, emailVerificationToken, emailVerificationTokenExpiration)
VALUES (?, ?, ?, ?);
`;
