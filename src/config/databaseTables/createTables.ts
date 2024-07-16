/* eslint-disable no-console */
import { exit } from 'process';
import {
  usersTable,
  lawyersTable,
  lawyerSpecializationsTable,
  specializationsTable,
  casesTable,
} from './tablesQueries';
import pool from '../db.config';
import { specializations } from './specjalizations';
import { createInsertSpecializationsQuery, insertSpecializations } from './insertSpecializations';

const createDatabaseTablesIfNotExists = async (connection: typeof pool) => {
  try {
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
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      exit(1);
    }
  }
};

export const runTablesSetup = () => {
  createDatabaseTablesIfNotExists(pool);
  insertSpecializations(createInsertSpecializationsQuery(specializations));
};
