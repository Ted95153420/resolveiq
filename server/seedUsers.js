const fs = require("fs");
const path = require("path");
const db = require("./db");

const usersJsonPath = path.join(__dirname, "data", "users.json");

function seedUsers() {
    const fileContents = fs.readFileSync(usersJsonPath, "utf-8");
    const users = JSON.parse(fileContents);

    const insertUser = db.prepare(`
        INSERT INTO users (id, name, username, age, nationality, loyaltypointbalance)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((usersToInsert) => {
        for (const user of usersToInsert) {
            insertUser.run(
                user.id,
                user.name,
                user.username,
                user.age,
                user.nationality,
                user.loyaltypointbalance ?? 0
            );
        }
    });

    insertMany(users);

    console.log(`${users.length} users seeded into SQLite.`);
}

seedUsers();