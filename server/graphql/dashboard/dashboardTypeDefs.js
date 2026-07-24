const dashboardTypeDefs = `#graphql

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

 extend type Query {
    users: [User!]!
    user(id: ID!): User!
 }

 extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUserName(input: UpdateUsernameInput!): User
    deleteUser(id: ID!): User
    adjustPoints(input: AdjustPointsInput!): PointsAdjustmentResult!
  }

`;

module.exports = {
    dashboardTypeDefs
};