const playerSimulatorTypeDefs = `#graphql
    type PlayerChoice {
        id: Int!
        name: String!
        username: String!
        loyaltypointbalance: Int!
    }

    type PlayerBalanceUpdate {
        username: String!
        loyaltypointbalance: Int!
    }

    extend type Query {
        playerChoices: [PlayerChoice!]!
    }

    extend type Subscription {
        playerBalanceUpdated(
            username: String!
        ): PlayerBalanceUpdate!
    }
`;

module.exports = {
    playerSimulatorTypeDefs,
};