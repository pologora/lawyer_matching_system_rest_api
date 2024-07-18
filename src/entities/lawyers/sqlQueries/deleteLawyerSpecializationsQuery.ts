export const deleteLawyerSpecializationsQuery = `
DELETE FROM LawyerSpecialization
WHERE lawyerId = ?
`;
