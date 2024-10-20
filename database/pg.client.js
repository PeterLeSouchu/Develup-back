import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PG_USER || 'develup',
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB_NAME || 'develup',
  // ssl: {
  //   rejectUnauthorized: true,
  // },
});

let client = null;
try {
  client = await pool.connect();
  console.log('Connected to the database');
} catch (err) {
  console.error('Connection error', err.stack);
  throw err;
}

export default client;
