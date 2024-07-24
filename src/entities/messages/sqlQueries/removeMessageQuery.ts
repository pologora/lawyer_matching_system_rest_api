export const removeMessageQuery = `
DELETE FROM Message
WHERE messageId = ?;
`;
