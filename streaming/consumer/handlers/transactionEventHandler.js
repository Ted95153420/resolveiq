const {
    createTransaction,
} = require(
    "../../../server/services/transactionService"
);

const {
    publishPlayerBalanceUpdated,
} = require(
    "../publishers/playerBalanceUpdatedPublisher"
);

function buildPlayerBalanceUpdate(
    event,
    transactionResult
) {
    const {
        transaction,
        loyalty,
    } = transactionResult;

    return {
        username:
            loyalty.updatedUser.username,

        previousBalance:
            loyalty.previousBalance,

        newBalance:
            loyalty.newBalance,

        pointsDelta:
            loyalty.earnedPoints,

        sourceTransactionId:
            transaction.id,

        sourceEventId:
            event.eventId,
    };
}

async function handleTransactionEvent(event) {
    if (
        event.eventType !==
        "transaction.created"
    ) {
        console.log(
            `Unhandled transaction event type: ${event.eventType}`
        );

        return;
    }

    const transactionResult =
        await createTransaction(event);

    if (!transactionResult) {
        console.log(
            `Duplicate or skipped transaction event: ${event.eventId}`
        );

        return;
    }

    console.log(
        "Transaction processed from event:",
        transactionResult.transaction
    );

    const balanceUpdate =
        buildPlayerBalanceUpdate(
            event,
            transactionResult
        );

    await publishPlayerBalanceUpdated(
        balanceUpdate
    );
}

module.exports = {
    handleTransactionEvent,
};