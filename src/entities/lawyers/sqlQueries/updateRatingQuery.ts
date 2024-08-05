export const updateRatingQuery = `
UPDATE LawyerProfile
SET rating = (SELECT AVG(rating) from Review WHERE lawyerId = ?)
WHERE lawyerProfileId = ?;
`;
