const {
    runConsumer,
} = require("@resolveiq/kafka");

const {
    handlePlayerBalanceUpdatedEvent,
} = require("./handlers/playerBalanceUpdatedEventHandler");

async function startPlayerBalanceConsumer() {
    await runConsumer({
        clientId:
            "resolveiq-player-balance-consumer",

        groupId:
            "resolveiq-player-balance-group",

        topic:
            "player-balance-events",

        handler:
            handlePlayerBalanceUpdatedEvent,
    });
}

module.exports = {
    startPlayerBalanceConsumer,
};