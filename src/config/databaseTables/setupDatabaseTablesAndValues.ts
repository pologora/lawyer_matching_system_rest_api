/* eslint-disable no-console */
import { exit } from 'process';
import fs from 'fs';
import path from 'path';
import pool from '../db.config';

export const runTablesSetup = async () => {
  const sqlFilePath = path.join(__dirname, '..', 'initDockerDb', 'setup.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  // Split the SQL file into individual statements
  const dataArr = sql.toString().split(';');

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < dataArr.length; i++) {
      const query = dataArr[i].trim();
      if (query) {
        await connection.query(`${query};`);
      }
    }

    await connection.commit();
    console.log('All SQL statements executed successfully.');
    connection.release();
  } catch (error) {
    console.error('Error executing SQL:', error);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
  } finally {
    exit(1);
  }
};

runTablesSetup();
