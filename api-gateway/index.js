require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit"); // ✅ Added

// ✅ Custom rate limiter middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // Limit each IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Custom data source to inject user headers
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.user) {
      request.http.headers.set("x-user-id", context.user.userId);
      request.http.headers.set("x-user-email", context.user.email);
    }
  }
}

// ✅ Apollo Gateway setup
const gateway = new ApolloGateway({
  serviceList: [
    { name: "user", url: "http://localhost:4000/graphql" },
    { name: "order", url: "http://localhost:5000/graphql" },
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

// ✅ Token verifier
function getUserFromToken(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ✅ Start server with rate limiter and context
async function startServer() {
  const app = express();

  app.use(rateLimiter); // ✅ Apply rate limiter

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req, res }) => {
      const user = getUserFromToken(req);
      console.log("user", user);
      return { user, req, res };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀 Gateway running at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
  });
}

startServer();
