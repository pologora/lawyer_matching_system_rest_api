export const getManyCasesQuery = `
SELECT caseId, clientId, lawyerId, description, status, createdAt, updatedAt
FROM \`Case\`;
`;
