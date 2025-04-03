const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'dvwa',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'dvwadb',
    password: process.env.DB_PASSWORD || 'moktu5',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

module.exports = pool; 