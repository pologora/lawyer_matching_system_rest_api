import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { ENV_FILES_MAP } from './constants';

const envFile = ENV_FILES_MAP.get(process.env.NODE_ENV!);
dotenv.config({ path: envFile });

const pool = mysql.createPool({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOSTNAME,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
});

export default pool;
