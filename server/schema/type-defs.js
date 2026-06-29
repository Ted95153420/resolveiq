const typeDefs = `#graphql
 type User {
      id: Int!
      name: String!
      username: String!
      age: Int!
      nationality: Nationality!
      loyaltypointbalance:Int!
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