const {
    publishPlayerBalanceUpdated,
} = require("../events/playerBalanceEvents");

const {
    validateIncomingTransaction,
} = require("../validators/transactionValidator");

const {
    getUserByUsername,
} = require("../repositories/userRepository");

const {
    applyPointsAdjustment,
} = require("../repositories/pointsAdjustmentRepository");

async function adjustPoints(input) {
    const incomingAdjustment = {
        username: input.username,
        transactioncode: "ADJ",
        points_delta: input.pointsDelta,
        adjustment_reason: input.reason,
    };

    validateIncomingTransaction(incomingAdjustment);

    const existingUser = await getUserByUsername(input.username);

    if (!existingUser) {
        throw new Error(
            `User with username '${input.username}' does not exist`
        );
    }

    const result = await applyPointsAdjustment({
        userId: existingUser.id,
        pointsDelta: input.pointsDelta,
        adjustmentReason: input.reason.trim(),
    });

    await publishPlayerBalanceUpdated(result.user);

    return result;
}

module.exports = {
    adjustPoints,
};