/* eslint-disable no-console */
import { exit } from 'process';
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
import { specializations } from './specjalizations';
import { createInsertSpecializationsQuery, insertSpecializations } from './insertSpecializations';

const createDatabaseTablesIfNotExists = async (connection: typeof pool) => {
  await connection.query(usersTable);
  console.log('Users table created successfully.');

  await connection.query(lawyersTable);
  console.log('Lawyers table created successfully.');

  await connection.query(specializationsTable);
  console.log('Specializations table created successfully.');

  await connection.query(lawyerSpecializationsTable);
  console.log('Lawyer specializations table created successfully.');

  await connection.query(casesTable);
  console.log('Cases table created successfully.');

  await connection.query(clientProfilesTable);
  console.log('Client profiles table created successfully.');

  await connection.query(messagesTable);
  console.log('Messages table created successfully.');

  await connection.query(reviewsTable);
  console.log('Reviews  table created successfully.');
};

export const runTablesSetup = async () => {
  try {
    await createDatabaseTablesIfNotExists(pool);
    await insertSpecializations(createInsertSpecializationsQuery(specializations));
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      exit(1);
    }
  }
};
