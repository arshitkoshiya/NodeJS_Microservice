const Order = require("../models/Order");
const { getChannel, getUserData } = require("../rabbitmq/connection");

module.exports = {
  Query: {
    orders: async () => await Order.find(),
  },

  Mutation: {
    createOrder: async (_, { product, amount }, { req }) => {
      const userId = req.headers["x-user-id"];
      const userEmail = req.headers["x-user-email"];
      if (!userId || !userEmail) {
        throw new Error("Unauthorized: Missing user information");
      }

      const order = await Order.create({ userId, product, amount });

      try {
        const user = await getUserData(userId);
        const channel = getChannel();

        const emailPayload = {
          name: user.name,
          email: user.email,
          product,
          quantity: 1,
          amount,
        };

        channel.sendToQueue(
          "order_created",
          Buffer.from(JSON.stringify(emailPayload))
        );

        console.log("📤 Sent order_created message to queue");
      } catch (err) {
        console.warn(
          "⚠️ Failed to fetch user data or send message:",
          err.message
        );
      }

      return order;
    },
  },
};

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid token");
  }
}
