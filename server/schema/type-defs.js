const typeDefs = `#graphql
 type Transaction {
      id: String!
      user_id: Int!
      transactioncode: TransactionCode!
      gametype: String
      amountwagered: Float
      points_delta: Int!
      adjustment_reason: String
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

  input AdjustPointsInput {
    username: String!
    pointsDelta: Int!
    reason: String!
  }

  input UpdateUsernameInput {
      id: ID!
      newUserName: String!
  }

  type PointsAdjustmentResult {
    transaction: Transaction!
    user: User!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUserName(input: UpdateUsernameInput!): User
    deleteUser(id: ID!): User
    adjustPoints(input: AdjustPointsInput!): PointsAdjustmentResult!
  }

  enum TransactionCode{
      TRAN
      ADJ
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