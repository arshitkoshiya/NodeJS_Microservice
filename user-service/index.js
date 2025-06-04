// ==========================
// user-service/index.js
// ==========================
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const connectRabbitMQ = require("./rabbitmq/connection");

async function startServer() {
  const app = express();

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("User Service: MongoDB connected");

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    context: ({ req }) => {
      // Extract user from request headers if available
      const user = req.headers.user ? JSON.parse(req.headers.user) : null;
      return { user, req };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  await connectRabbitMQ();

  app.listen(process.env.PORT, () => {
    console.log(
      `User service running at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
}

startServer();
