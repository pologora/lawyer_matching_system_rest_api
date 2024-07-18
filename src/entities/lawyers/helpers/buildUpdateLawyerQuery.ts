export const buildUpdateLawyerQuery = (data: object) => {
  const keyValuePairs = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      keyValuePairs.push(`${key} = ?`);
      values.push(value);
    }
  }
  const query = `UPDATE LawyerProfile SET ${keyValuePairs.join(', ')} WHERE lawyerProfileId = ?;`;

  return { query, values };
};
