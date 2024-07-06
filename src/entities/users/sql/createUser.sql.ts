export const createUserQuery = `
INSERT INTO users (email, password)
VALUES (?, ?);
`;
