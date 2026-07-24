const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

function getPlayerBalanceTopic(username) {
    return `PLAYER_BALANCE_UPDATED:${username}`;
}

async function publishPlayerBalanceUpdated(user) {
    await pubsub.publish(
        getPlayerBalanceTopic(user.username),
        {
            playerBalanceUpdated: {
                username: user.username,
                loyaltypointbalance: user.loyaltypointbalance,
            },
        }
    );
}

module.exports = {
    pubsub,
    getPlayerBalanceTopic,
    publishPlayerBalanceUpdated,
};