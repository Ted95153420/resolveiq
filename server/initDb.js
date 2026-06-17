//only needs to be run once. HINT node innitDb.js
//sets up the postgres table for demo purposes

const pool = require("./db");

async function init() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      age INTEGER NOT NULL,
      nationality TEXT NOT NULL,
      loyaltypointbalance INTEGER NOT NULL DEFAULT 0
    )
  `);

    console.log("Users table is ready.");
    await pool.end();
}

init().catch((error) => {
    console.error("DB init failed:", error);
    process.exit(1);
});