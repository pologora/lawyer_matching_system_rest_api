export const getReviewQuery = `
SELECT reviewId, clientId, lawyerId, reviewText, rating
FROM Review
WHERE reviewId = ?;
`;
