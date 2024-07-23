export const getOneClientQuery = `
SELECT userId, clientProfileId,  firstName, lastName FROM ClientProfile where clientProfileId = ?
`;
