export const createUserQuery = `
INSERT INTO users (name, email, password)
VALUES (?, ?, ?);
`;
