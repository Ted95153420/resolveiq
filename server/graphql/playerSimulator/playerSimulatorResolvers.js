const {
    getUsers,
    getUserByUsername,
} = require("../../repositories/userRepository");

const {
    pubsub,
    getPlayerBalanceTopic,
} = require("../../events/playerBalanceEvents");

const playerSimulatorResolvers = {
    Query: {
        playerChoices: async () => {
            const users = await getUsers();

            return users.map((user) => ({
                id: user.id,
                name: user.name,
                username: user.username,
                loyaltypointbalance: user.loyaltypointbalance,
            }));
        },

        playerAccount: async (_, { username }) => {
            return getUserByUsername(username);
        },
    },

    Subscription: {
        playerBalanceUpdated: {
            subscribe: (_, { username }) => {
                return pubsub.asyncIterableIterator(
                    getPlayerBalanceTopic(username)
                );
            },
        },
    },
};

module.exports = {
    playerSimulatorResolvers,
};