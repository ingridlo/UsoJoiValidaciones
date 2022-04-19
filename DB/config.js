const { Pool } = require('pg');

const pool =new Pool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
    max: 20,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000
})


module.exports= { pool }