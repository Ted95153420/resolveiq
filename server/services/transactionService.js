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

function buildTransaction(payload, userId) {
    return {
        id: payload.id,
        user_id: userId,
        transactioncode:
            payload.transactioncode,
        gametype:
            payload.gametype,
        amountwagered:
            payload.amountwagered,
        points_delta:
            calculatePointsFromAmount(
                payload.amountwagered
            ),
        adjustment_reason:
            payload.adjustment_reason ?? null,
        transaction_timestamp:
            payload.transaction_timestamp ??
            new Date().toISOString(),
    };
}

async function createTransaction(event) {
    const { eventId, eventType, payload } = event;

    const alreadyProcessed = await hasProcessedEvent(eventId);

    if (alreadyProcessed) {
        return null;
    }

    validateIncomingTransaction(payload);

    const user = await getUserByUsername(payload.username);

    if (!user) {
        console.log(
            `User with username ${payload.username} does not exist. Cannot add transaction for a non-existent user.`
        );
        await recordProcessedEvent(eventId, eventType);
        return null;
    }

    const pointsDelta = calculatePointsFromAmount(payload.amountwagered)

    const transaction = 
        buildTransaction(
            payload,
            user.id
    );

    await addTransaction(transaction);
    const loyalty = await applyTransactionToLoyalty(user, transaction);
    await recordProcessedEvent(eventId, eventType);

    return {
        transaction,
        loyalty,
    };
}

module.exports = { createTransaction };