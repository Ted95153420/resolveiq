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

module.exports = {
    addTransaction
};