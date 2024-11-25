import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

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

console.log('voici le process env');
console.log(process.env.PORT);

let client = null;
try {
  client = await pool.connect();
  console.log('connexion etablie a postgres');
} catch (err) {
  console.error('Connection error', err.stack);
  throw err;
}

export default client;
