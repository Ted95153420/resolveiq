const { addTransaction } = require("../repositories/transactionRepository");
const { getUserByUsername } = require("../repositories/userRepository");
const {
    hasProcessedEvent,
    recordProcessedEvent,
} = require("../repositories/processedEventRepository");
const { applyTransactionToLoyalty, calculatePointsFromAmount } = require("./loyaltyService");
const {
    validateIncomingTransaction,
} = require("../validators/transactionValidator");

async function createTransaction(event) {
    const { eventId, eventType, payload } = event;

    const alreadyProcessed = await hasProcessedEvent(eventId);

    if (alreadyProcessed) {
        return null;
    }

    validateIncomingTransaction(payload);

    const existingUser = await getUserByUsername(payload.username);

    if (!existingUser) {
        console.log(
            `User with username ${payload.username} does not exist. Cannot add transaction for a non-existent user.`
        );
        await recordProcessedEvent(eventId, eventType);
        return null;
    }

    const pointsDelta = calculatePointsFromAmount(payload.amountwagered)

    const newTransaction = {
        id: payload.id,
        user_id: existingUser.id,
        transactioncode: payload.transactioncode,
        gametype: payload.gametype,
        amountwagered: payload.amountwagered,
        points_delta: pointsDelta,
        adjustment_reason: payload.adjustment_reason ?? null,
        transaction_timestamp:
            payload.transaction_timestamp ?? new Date().toISOString(),
    };

    await addTransaction(newTransaction);
    const loyaltyResult = await applyTransactionToLoyalty(existingUser, newTransaction);
    await recordProcessedEvent(eventId, eventType);

    return {
        transaction: newTransaction,
        loyalty : loyaltyResult,
    };
}

module.exports = { createTransaction };