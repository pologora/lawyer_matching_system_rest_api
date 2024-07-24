export const getMessageQuery = `
SELECT messageId, senderId, receiverId, message, createdAt, updatedAt
FROM Message
WHERE messageId = ?;
`;
