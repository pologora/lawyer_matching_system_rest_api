export const registerByEmailQuery = `
INSERT INTO User (email, password)
VALUES (?, ?);
`;
