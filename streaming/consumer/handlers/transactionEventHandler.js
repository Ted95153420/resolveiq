const {
    createTransaction,
} = require("../../../server/services/transactionService");

const {
    publishPlayerBalanceUpdated,
} = require("../publishers/playerBalanceUpdatedPublisher");

async function handleTransactionEvent(event) {
    if (event.eventType !== "transaction.created") {
        console.log(
            `Unhandled transaction event type: ${event.eventType}`
        );

        return;
    }

    const createdTransaction =
        await createTransaction(event);

    if (!createdTransaction) {
        console.log(
            `Duplicate or skipped transaction event: ${event.eventId}`
        );

        return;
    }

    console.log("Transaction added from event:");
    console.log(createdTransaction);

    const {
        transaction,
        loyalty,
    } = createdTransaction;

    await publishPlayerBalanceUpdated({
        username: loyalty.updatedUser.username,
        previousBalance:
            loyalty.newBalance -
            loyalty.earnedPoints,
        newBalance: loyalty.newBalance,
        pointsDelta: loyalty.earnedPoints,
        sourceTransactionId: transaction.id,
        sourceEventId: event.eventId,
    });
}

module.exports = {
    handleTransactionEvent,
};