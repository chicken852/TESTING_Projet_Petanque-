require('dotenv').config();  // Load the .env file

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'petanque_db',
    password: process.env.DB_PASSWORD || 'Maldek123@',
    port: process.env.DB_PORT || 5432 // Ensure this is coming from .env
});

pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;







