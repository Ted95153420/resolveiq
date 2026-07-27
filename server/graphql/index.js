const {
    baseTypeDefs,
} = require("./schema/baseTypeDefs");

const {
    dashboardTypeDefs,
} = require("./dashboard/dashboardTypeDefs");

const {
    dashboardResolvers,
} = require("./dashboard/dashboardResolvers");

const {
    playerSimulatorTypeDefs,
} = require("./playerSimulator/playerSimulatorTypeDefs");

const {
    playerSimulatorResolvers,
} = require("./playerSimulator/playerSimulatorResolvers");

const typeDefs = [
    baseTypeDefs,
    dashboardTypeDefs,
    playerSimulatorTypeDefs,
];

const resolvers = {
    Query: {
        ...dashboardResolvers.Query,
        ...playerSimulatorResolvers.Query,
    },

    Mutation: {
        ...dashboardResolvers.Mutation,
        ...playerSimulatorResolvers.Mutation,
    },

    Subscription: {
        ...playerSimulatorResolvers.Subscription,
    },

    User: {
        ...dashboardResolvers.User,
    },

    Transaction: {
        ...dashboardResolvers.Transaction,
    },
};

module.exports = {
    typeDefs,
    resolvers,
};