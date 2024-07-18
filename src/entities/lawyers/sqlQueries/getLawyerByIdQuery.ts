export const getLawyerByIdQuery = `
SELECT 
    lp.id, 
    lp.userId, 
    lp.licenseNumber, 
    lp.bio, 
    lp.experience, 
    lp.firstName, 
    lp.lastName, 
    lp.city, 
    lp.region, 
    lp.rating,
    GROUP_CONCAT(s.name) AS specializations
FROM 
    LawyerProfile lp
LEFT JOIN 
    LawyerSpecialization ls ON lp.lawyerId = ls.lawyerId
LEFT JOIN 
    Specialization s ON ls.specializationId = s.specializationId
WHERE lp.lawyerProfileId = ?
GROUP BY 
    lp.id, lp.userId, lp.licenseNumber, lp.bio, lp.experience, lp.firstName, lp.lastName, lp.city, lp.region, lp.rating;`;
