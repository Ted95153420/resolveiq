const baseTypeDefs = `#graphql

type Query
type Mutation
type Subscription

 enum TransactionCode {
     TRAN
     ADJ
 }

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
    loyaltypointbalance: Int!
    transactions: [Transaction!]!
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

module.exports = {
    baseTypeDefs,
};