const typeDefs = `#graphql
 type Transaction {
      id: String!
      user_id: Int!
      gametype: String!
      amountwagered: Float!
      transaction_timestamp: String!
 }


 type User {
      id: Int!
      name: String!
      username: String!
      age: Int!
      nationality: Nationality!
      loyaltypointbalance:Int!
      transactions: [Transaction!]!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!
  }

  input CreateUserInput {
      name: String!
      username: String!
      age: Int!
      nationality: Nationality = CANADA
  }

  input UpdateUsernameInput {
      id: ID!
      newUserName: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUserName(input: UpdateUsernameInput!): User
    deleteUser(id: ID!): User
  }

  enum Nationality {
    AUSTRALIA
    CANADA
    DENMARK
    FRANCE
    GERMANY
    IRELAND
    NETHERLANDS
    NEW_ZEALAND
    NORWAY
    SWEDEN
    UNITED_KINGDOM
    UNITED_STATES
  }
`;

module.exports = { typeDefs };