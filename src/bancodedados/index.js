const { Pool } = require('pg');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
};

const pool = new Pool(dbConfig);

module.exports = pool;
