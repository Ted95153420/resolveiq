const pool = require("../db");


async function addTransaction(newTransaction) {
    await pool.query(`
    INSERT INTO transactions (
        id, 
        user_id, 
        transactioncode,
        gametype, 
        amountwagered,
        points_delta,
        adjustment_reason,
        transaction_timestamp)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
        newTransaction.id,
        newTransaction.user_id,
        newTransaction.transactioncode,
        newTransaction.gametype,
        newTransaction.amountwagered,
        newTransaction.points_delta,
        newTransaction.adjustment_reason,
        newTransaction.transaction_timestamp,
    ]);

    return newTransaction;
}

async function getTransactionsByUserId(userId) {
    const result = await pool.query(`
        SELECT id, 
               user_id, 
               transactioncode,
               gametype, 
               amountwagered, 
               points_delta,
               adjustment_reason,
               transaction_timestamp
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