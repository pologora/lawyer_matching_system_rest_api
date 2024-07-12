export const deleteMeQuery = `
UPDATE users
SET active = false
where id = ?
`;
