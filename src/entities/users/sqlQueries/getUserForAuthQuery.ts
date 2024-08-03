export const getUserForAuthQuery = `
SELECT *
FROM User where userId = ?;
`;
