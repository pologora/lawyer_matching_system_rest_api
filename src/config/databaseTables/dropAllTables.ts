/* eslint-disable no-console */
import pool from '../db.config';

export const dropAllTablesQuery = `
DROP TABLE IF EXISTS cases,
    lawyer_specializations,
    specializations,
    messages,
    reviews,
    lawyer_profiles,
    client_profiles,
    users;
`;

export const dropAllTables = async (query: string) => {
  try {
    await pool.query(query);
    console.log('________________All tables droped__________________');
  } catch (error) {
    console.log(error);
  }
};
