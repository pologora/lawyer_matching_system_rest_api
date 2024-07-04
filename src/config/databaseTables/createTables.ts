/* eslint-disable no-console */
import { exit } from 'process';
import { createUsersTable } from './tables.sql';
import pool from '../db.config';

const createDatabaseTablesIfNotExists = async (connection: typeof pool, query: string) => {
  try {
    await connection.query(query);
    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      exit(1);
    }
  }
};

createDatabaseTablesIfNotExists(pool, createUsersTable);

export const runTablesSetup = () => {
  createDatabaseTablesIfNotExists(pool, createUsersTable);
};
