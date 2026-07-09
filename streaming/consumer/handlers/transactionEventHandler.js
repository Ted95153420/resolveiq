const { createTransaction } = require("../../../server/services/transactionService");

async function handleTransactionEvent(event) {
    if (event.eventType === "transaction.created") {
        const createdTransaction = await createTransaction(event);

        if (createdTransaction) {
            console.log("Transaction added from event:");
            console.log(createdTransaction);
        } else {
            console.log(`Duplicate or skipped transaction event: ${event.eventId}`);
        }
    }

    console.log(`Unhandled user event type: ${event.eventType}`);
}

module.exports = { handleTransactionEvent };