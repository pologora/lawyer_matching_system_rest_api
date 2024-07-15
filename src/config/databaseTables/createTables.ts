/* eslint-disable no-console */
import { exit } from 'process';
import { usersTable, lawyersTable, lawyer_specializationsTable, specializationsTable } from './tables.sql';
import pool from '../db.config';

const createDatabaseTablesIfNotExists = async (connection: typeof pool) => {
  try {
    await connection.query(usersTable);
    console.log('Users table created successfully.');

    await connection.query(lawyersTable);
    console.log('Lawyers table created successfully.');

    await connection.query(specializationsTable);
    console.log('Specializations table created successfully.');

    await connection.query(lawyer_specializationsTable);
    console.log('Lawyer specializations table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      exit(1);
    }
  }
};

createDatabaseTablesIfNotExists(pool);

export const runTablesSetup = () => {
  createDatabaseTablesIfNotExists(pool);
};
