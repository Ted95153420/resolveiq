const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "resolveiq",
    user: process.env.DB_USER || "resolveiq_user",
    password: process.env.DB_PASSWORD || "resolveiq_pass",
});

module.exports = pool;