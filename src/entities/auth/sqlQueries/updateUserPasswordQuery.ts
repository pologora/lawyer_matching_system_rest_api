export const updateUserPasswordQuery = `
UPDATE User
SET password = ?,
    resetPasswordToken = null, 
    resetPasswordTokenExpiration = null,
    passwordChangedAt = CURRENT_TIMESTAMP()
WHERE userId = ?
`;
