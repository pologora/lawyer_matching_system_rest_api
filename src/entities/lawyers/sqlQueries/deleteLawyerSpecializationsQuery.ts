export const deleteLawyerSpecializationsQuery = `
DELETE FROM lawyer_specializations
WHERE lawyer_id = ?
`;
