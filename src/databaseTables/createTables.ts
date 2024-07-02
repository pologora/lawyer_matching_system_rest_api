import { exit } from 'process';
import pool from '../config/db.config';
import { createUsersTable } from './tables.sql';

const createDatabaseTablesIfNotExists = async (connection: typeof pool, query: string) => {
  try {
    await connection.query(query);
    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    exit(1);
  }
};

createDatabaseTablesIfNotExists(pool, createUsersTable);
