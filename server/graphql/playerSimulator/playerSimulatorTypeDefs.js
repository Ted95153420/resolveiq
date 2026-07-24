const playerSimulatorTypeDefs = `#graphql
    type PlayerChoice {
        id: Int!
        name: String!
        username: String!
    }

    extend type Query {
        playerChoices: [PlayerChoice!]!
    }
`;

module.exports = {
    playerSimulatorTypeDefs,
};