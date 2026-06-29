const pool = require("../db");


async function addTransaction(newTransaction) {
    await pool.query(`
    INSERT INTO transactions (id, user_id, gametype, amountwagered, transaction_timestamp)
    VALUES ($1, $2, $3, $4, $5)
  `, [
        newTransaction.id,
        newTransaction.user_id,
        newTransaction.gametype,
        newTransaction.amountwagered,
        newTransaction.transaction_timestamp
    ]);

    return newTransaction;
}

async function getTransactionsByUserId(userId) {
    const result = await pool.query(`
        SELECT id, user_id, gametype, amountwagered, transaction_timestamp
        FROM transactions
        WHERE user_id = $1
        ORDER BY transaction_timestamp DESC
        LIMIT 20
    `, [Number(userId)]);

    return result.rows;
}

module.exports = {
    addTransaction,
    getTransactionsByUserId
};