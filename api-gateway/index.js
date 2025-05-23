require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'user', url: 'http://localhost:4000/graphql' },
    { name: 'order', url: 'http://localhost:5000/graphql' },
  ],
  buildService({ name, url }) {
    return new (require('@apollo/gateway').RemoteGraphQLDataSource)({ url });
  }
});

async function startServer() {
  const app = express();
  const server = new ApolloServer({ gateway, subscriptions: false });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Gateway running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
}

startServer();
