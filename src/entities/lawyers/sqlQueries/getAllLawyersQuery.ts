export const getAllLawyersQuery = `
SELECT 
    lp.id, 
    lp.user_id, 
    lp.license_number, 
    lp.bio, 
    lp.experience, 
    lp.first_name, 
    lp.last_name, 
    lp.city, 
    lp.region, 
    lp.rating,
    GROUP_CONCAT(s.name) AS specialization
FROM 
    lawyer_profile lp
LEFT JOIN 
    lawyer_specialization ls ON lp.id = ls.lawyer_id
LEFT JOIN 
    specialization s ON ls.specialization_id = s.id
GROUP BY 
    lp.id, lp.user_id, lp.license_number, lp.bio, lp.experience, lp.first_name, lp.last_name, lp.city, lp.region, lp.rating;
`;
