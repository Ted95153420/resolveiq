const {
    getUsers,
} = require("../../repositories/userRepository");

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
    },
};

module.exports = {
    playerSimulatorResolvers,
};