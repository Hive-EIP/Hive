const { pool } = require('../config/postgres');

async function testDB() {
    const res = await pool.query('SELECT NOW()');
    console.log(res.rows[0]);
    pool.end();
}

testDB();
