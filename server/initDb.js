//only needs to be run once. HINT node innitDb.js
//sets up the postgres table for demo purposes

const pool = require("./db");

async function init() {
    await pool.query(`

    DROP TABLE IF EXISTS transactions;
        DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT NOT NULL,
            age INTEGER NOT NULL,
            nationality TEXT NOT NULL
            loyaltypointbalance INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            gametype TEXT NOT NULL,
            amountwagered NUMERIC(10,2) NOT NULL,
            transaction_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

  `);

    console.log("Users and transactionstable is ready.");
    await pool.end();
}

init().catch((error) => {
    console.error("DB init failed:", error);
    process.exit(1);
});