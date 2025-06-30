const { Pool } = require('pg');
const pool = new Pool({
    user: 'hive',
    host: 'localhost',
    database: 'hivedb',
    password: 'hivepass',
    port: 5432,
});
module.exports = { pool };
