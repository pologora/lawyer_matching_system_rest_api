export const deleteMeQuery = `
UPDATE User
SET active = false
where userId = ?
`;
