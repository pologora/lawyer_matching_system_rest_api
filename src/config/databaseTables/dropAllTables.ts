/* eslint-disable no-console */
import pool from '../db.config';

export const dropAllTablesQuery = `
DROP TABLE IF EXISTS \`Case\`,
    LawyerSpecialization,
    Specialization,
    Message,
    Review,
    LawyerProfile,
    ClientProfile,
    \`User\`
`;

export const dropAllTables = async (query: string) => {
  try {
    await pool.query(query);
    console.log('________________All tables droped__________________');
  } catch (error) {
    console.log(error);
  }
};
