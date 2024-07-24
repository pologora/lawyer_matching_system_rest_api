export const getOneCaseQuery = `
SELECT caseId, clientId, lawyerId, description, status, createdAt, updatedAt
FROM \`Case\`
WHERE caseId = ?;
`;
