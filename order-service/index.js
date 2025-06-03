// ==========================
// order-service/index.js
// ==========================
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { connectRabbitMQ } = require("./rabbitmq/connection");
const { buildSubgraphSchema } = require("@apollo/subgraph");
require("dotenv").config();

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  await connectRabbitMQ(); // ✅ Ensure RabbitMQ is ready

  const app = express();
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    context: ({ req }) => {
      return { req };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 5000 }, () =>
    console.log(
      `🚀 Order service ready at http://localhost:5000${server.graphqlPath}`
    )
  );
};

startServer();
