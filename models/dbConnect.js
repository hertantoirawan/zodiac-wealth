import pg from 'pg';

// Initialise DB connection
const { Pool } = pg;

let pgConnectionConfigs;

// test to see if the env var is set. Then we know we are in Heroku
if (process.env.DATABASE_URL) {
  // pg will take in the entire value and use it to connect
  pgConnectionConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  pgConnectionConfigs = {
    user: 'hirawan',
    host: 'localhost',
    database: 'zodiac_wealth',
    port: 5432,
  };
}
const pool = new Pool(pgConnectionConfigs);

export default pool;
