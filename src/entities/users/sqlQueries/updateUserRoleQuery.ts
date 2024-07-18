export const updateUserRoleQuery = `
UPDATE User role
SET role = ?
WHERE userId = ?
`;
