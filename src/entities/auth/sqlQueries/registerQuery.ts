export const registerNewUserQuery = `
INSERT INTO User (email, password)
VALUES (?, ?);
`;
