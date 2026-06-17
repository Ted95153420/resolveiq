const db = require("../db");

function getUsers() {
    const stmt = db.prepare(`
    SELECT id, name, username, age, nationality, loyaltypointbalance
    FROM users
    ORDER BY id
  `);

    return stmt.all();
}

function getUserById(id) {
    const stmt = db.prepare(`
    SELECT id, name, username, age, nationality, loyaltypointbalance
    FROM users
    WHERE id = ?
  `);

    return stmt.get(Number(id)) || null;
}

function addUser(newUser) {
    const stmt = db.prepare(`
    INSERT INTO users (id, name, username, age, nationality, loyaltypointbalance)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    stmt.run(
        newUser.id,
        newUser.name,
        newUser.username,
        newUser.age,
        newUser.nationality,
        newUser.loyaltypointbalance
    );

    return newUser;
}

function updateUserName(id, newUserName) {
    const existingUser = getUserById(id);

    if (!existingUser) {
        return null;
    }

    const stmt = db.prepare(`
    UPDATE users
    SET username = ?
    WHERE id = ?
  `);

    stmt.run(newUserName, Number(id));

    return getUserById(id);
}

function deleteUser(id) {
    const existingUser = getUserById(id);

    if (!existingUser) {
        return null;
    }

    const stmt = db.prepare(`
    DELETE FROM users
    WHERE id = ?
  `);

    stmt.run(Number(id));

    return null;
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUserName,
    deleteUser,
};