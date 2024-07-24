export const getLawyerByIdQuery = `
SELECT 
    lp.lawyerProfileId, 
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
    LawyerSpecialization ls ON lp.lawyerProfileId = ls.lawyerId
LEFT JOIN 
    Specialization s ON ls.specializationId = s.specializationId
WHERE lp.lawyerProfileId = ?
GROUP BY 
    lp.lawyerProfileId, lp.userId, lp.licenseNumber, lp.bio, lp.experience, lp.firstName, lp.lastName, lp.city, lp.region, lp.rating;`;
