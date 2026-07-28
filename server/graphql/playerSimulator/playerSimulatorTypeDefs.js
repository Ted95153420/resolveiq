const playerSimulatorTypeDefs = `#graphql
    type PlayerChoice {
        id: Int!
        name: String!
        username: String!
        loyaltypointbalance: Int!
    }

    type PlayerAccount {
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

        playerAccount(
            username: String!
        ): PlayerAccount
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