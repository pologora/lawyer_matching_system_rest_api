export const createLawyerQuery = `
INSERT INTO lawyer_profiles ("experience", "license_number", "bio", "first_name", "last_name", "city", "region")
VALUES (?, ?, ?, ?, ?, ?, ?);
`;
