// db.js
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_tracker',
    password: 'coding2024',
    port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
