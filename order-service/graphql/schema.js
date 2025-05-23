const { gql } = require('apollo-server-express');

module.exports = gql`
  type Order {
    id: ID!
    userId: ID!
    product: String!
    amount: Int!
  }

  type Query {
    orders: [Order]
  }

  type Mutation {
    createOrder(userId: ID!, product: String!, amount: Int!): Order
  }
`;
