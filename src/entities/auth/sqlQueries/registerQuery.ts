export const registerNewUserQuery = `
INSERT INTO users (email, password)
VALUES (?, ?);
`;
