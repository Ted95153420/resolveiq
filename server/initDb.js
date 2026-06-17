//only needs to be run once. HINT node innitDb.js
//sets up the SQLite table for demo purposes

const db = require("./db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL,
    age INTEGER NOT NULL,
    nationality TEXT NOT NULL,
    loyaltypointbalance INTEGER NOT NULL DEFAULT 0
  )
`).run();

console.log("Users table is ready.");