const pool = require("../db");

async function applyPointsAdjustment({
    userId,
    pointsDelta,
    adjustmentReason,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userResult = await client.query(
            `
            SELECT
                id,
                name,
                username,
                age,
                nationality,
                loyaltypointbalance
            FROM users
            WHERE id = $1
            FOR UPDATE
            `,
            [userId]
        );

        const user = userResult.rows[0];

        if (!user) {
            throw new Error(
                `User with ID '${userId}' does not exist`
            );
        }

        const newBalance =
            user.loyaltypointbalance + pointsDelta;

        if (newBalance < 0) {
            throw new Error(
                "Points adjustment cannot make the loyalty balance negative"
            );
        }

        const transactionResult = await client.query(
            `
            INSERT INTO transactions (
                user_id,
                transactioncode,
                gametype,
                amountwagered,
                points_delta,
                adjustment_reason
            )
            VALUES ($1, 'ADJ', NULL, NULL, $2, $3)
            RETURNING
                id,
                user_id,
                transactioncode,
                gametype,
                amountwagered,
                points_delta,
                adjustment_reason,
                transaction_timestamp
            `,
            [
                userId,
                pointsDelta,
                adjustmentReason,
            ]
        );

        const updatedUserResult = await client.query(
            `
            UPDATE users
            SET loyaltypointbalance =
                loyaltypointbalance + $1
            WHERE id = $2
            RETURNING
                id,
                name,
                username,
                age,
                nationality,
                loyaltypointbalance
            `,
            [
                pointsDelta,
                userId,
            ]
        );

        await client.query("COMMIT");

        return {
            transaction: transactionResult.rows[0],
            user: updatedUserResult.rows[0],
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    applyPointsAdjustment,
};