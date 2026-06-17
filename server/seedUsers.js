const db = require("./db");

async function seedUsers() {
    const user = {
        id: 1,
        name: "Lisa",
        username: "lisa01",
        age: 34,
        nationality: "CANADA",
        loyaltypointbalance: 0
    };

    await db.query(
        `
        INSERT INTO users (id, name, username, age, nationality, loyaltypointbalance)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
            user.id,
            user.name,
            user.username,
            user.age,
            user.nationality,
            user.loyaltypointbalance
        ]
    );

    console.log(`1 user seeded into Postgres.`);
    await db.end();
}

seedUsers().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
});