export const createUserQuery = `
INSERT INTO User (email, password)
VALUES (?, ?);
`;
