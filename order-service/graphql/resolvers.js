const Order = require("../models/Order");
const { getChannel, getUserData } = require("../rabbitmq/connection");

module.exports = {
  Query: {
    orders: async () => await Order.find(),
  },

  Mutation: {
    createOrder: async (_, { userId, product, amount }) => {
      // Create the order first
      const order = await Order.create({ userId, product, amount });

      try {
        const user = await getUserData(userId); // 🔁 call user service via RabbitMQ

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
