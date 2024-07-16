/* eslint-disable no-console */
import {
  usersTable,
  lawyersTable,
  lawyerSpecializationsTable,
  specializationsTable,
  casesTable,
  clientProfilesTable,
  messagesTable,
  reviewsTable,
} from './tablesQueries';
import pool from '../db.config';

export const createDatabaseTablesIfNotExists = async () => {
  await pool.query(usersTable);
  console.log('Users table created successfully.');

  await pool.query(lawyersTable);
  console.log('Lawyers table created successfully.');

  await pool.query(specializationsTable);
  console.log('Specializations table created successfully.');

  await pool.query(lawyerSpecializationsTable);
  console.log('Lawyer specializations table created successfully.');

  await pool.query(casesTable);
  console.log('Cases table created successfully.');

  await pool.query(clientProfilesTable);
  console.log('Client profiles table created successfully.');

  await pool.query(messagesTable);
  console.log('Messages table created successfully.');

  await pool.query(reviewsTable);
  console.log('Reviews  table created successfully.');
};
