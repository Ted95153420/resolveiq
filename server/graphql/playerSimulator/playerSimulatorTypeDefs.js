const playerSimulatorTypeDefs = `#graphql
    type PlayerChoice {
        id: Int!
        name: String!
        username: String!
        loyaltypointbalance: Int!
    }

    extend type Query {
        playerChoices: [PlayerChoice!]!
    }
`;

module.exports = {
    playerSimulatorTypeDefs,
};