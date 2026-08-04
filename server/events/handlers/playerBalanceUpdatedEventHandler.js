const {
    publishPlayerBalanceUpdated,
} = require("../playerBalanceEvents");

async function handlePlayerBalanceUpdatedEvent(event) {
    if (event.eventType !== "player.balance.updated") {
        return;
    }

    await publishPlayerBalanceUpdated({
        username: event.payload.username,
        loyaltypointbalance: event.payload.newBalance,
    });
}

module.exports = {
    handlePlayerBalanceUpdatedEvent,
};