const { addTransaction } = require("../repositories/transactionRepository");
const { getUserByUsername } = require("../repositories/userRepository");
const {
    hasProcessedEvent,
    recordProcessedEvent,
} = require("../repositories/processedEventRepository");

async function createTransaction(event) {
    const { eventId, eventType, payload } = event;

    const alreadyProcessed = await hasProcessedEvent(eventId);

    if (alreadyProcessed) {
        return null;
    }

    const existingUser = await getUserByUsername(payload.username);

    if (!existingUser) {
        console.log(
            `User with username ${payload.username} does not exist. Cannot add transaction for a non-existent user.`
        );
        await recordProcessedEvent(eventId, eventType);
        return null;
    }

    const newTransaction = {
        id: payload.id,
        user_id: existingUser.id,
        gametype: payload.gametype,
        amountwagered: payload.amountwagered,
        transaction_timestamp: payload.transaction_timestamp ?? new Date().toISOString(),
    };

    await addTransaction(newTransaction);
    await recordProcessedEvent(eventId, eventType);

    return newTransaction;
}

module.exports = { createTransaction };