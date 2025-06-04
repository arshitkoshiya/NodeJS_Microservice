// schema.js
const { gql } = require('apollo-server-express');

module.exports = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    login(email: String!): AuthPayload
  }
`;
