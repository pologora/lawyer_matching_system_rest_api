export const createUserQuery = `
INSERT INTO users (username, email, password)
VALUES (?, ?, ?);
`;
