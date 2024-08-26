export const getOneClientByUserIdQuery = `
SELECT userId, clientProfileId,  firstName, lastName FROM ClientProfile where userId = ?
`;
