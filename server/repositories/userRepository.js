const pool = require("../db");

async function getUsers() {
    const result = await pool.query(`
    SELECT id, name, username, age, nationality, loyaltypointbalance
    FROM users
    ORDER BY id
  `);

    return result.rows;
}

async function getUserById(id) {
    const result = await pool.query(`
    SELECT id, name, username, age, nationality, loyaltypointbalance
    FROM users
    WHERE id = $1
  `, [Number(id)]);

    return result.rows[0] || null;
}

async function addUser(newUser) {
    await pool.query(`
    INSERT INTO users (id, name, username, age, nationality, loyaltypointbalance)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [
        newUser.id,
        newUser.name,
        newUser.username,
        newUser.age,
        newUser.nationality,
        newUser.loyaltypointbalance
    ]);

    return newUser;
}

async function updateUserName(id, newUserName) {
    const result = await pool.query(`
    UPDATE users
    SET username = $1
    WHERE id = $2
    RETURNING id, name, username, age, nationality, loyaltypointbalance
  `, [newUserName, Number(id)]);

    return result.rows[0] || null;
}

async function updateUserLoyaltyBalance(id, newBalance) {
    const result = await pool.query(`
        UPDATE users
        SET loyaltypointbalance = $1
        WHERE id = $2
        RETURNING id, name, username, age, nationality, loyaltypointbalance
    `, [newBalance, Number(id)]);

    return result.rows[0] || null;
}

async function deleteUser(id) {
    await pool.query(`
    DELETE FROM users
    WHERE id = $1
  `, [Number(id)]);

    return null;
}

async function getUserByUsername(username) {
    const result = await pool.query(`
        SELECT id, name, username, age, nationality, loyaltypointbalance
        FROM users
        WHERE username = $1
    `, [username]);

    return result.rows[0] || null;
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUserName,
    updateUserLoyaltyBalance,
    deleteUser,
    getUserByUsername,
};