// schema.js
const { gql } = require('apollo-server-express');
module.exports = gql`
  type Order {
    id: ID!
    userId: ID!
    product: String!
    amount: Int!
  }

  extend type Query {
    orders: [Order]
  }

  extend type User @key(fields: "id") {
    id: ID!
    orders: [Order]
  }

  type Mutation {
    createOrder(product: String!, amount: Int!): Order
  }
`;
