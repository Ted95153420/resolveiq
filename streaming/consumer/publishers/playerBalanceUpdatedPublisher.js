async function publishPlayerBalanceUpdated(event) {
    throw new Error(
        `player.balance.updated publisher not implemented: ${JSON.stringify(event)}`
    );
}

module.exports = {
    publishPlayerBalanceUpdated,
};