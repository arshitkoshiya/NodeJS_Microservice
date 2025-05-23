const Order = require('../models/Order');
const { getChannel } = require('../rabbitmq/connection');

module.exports = {
  Query: {
    orders: async () => await Order.find(),
  },
  Mutation: {
    createOrder: async (_, { userId, product, amount }) => {
      const order = await Order.create({ userId, product, amount });

      try {
        const channel = getChannel(); // May throw error
        channel.sendToQueue('order_created', Buffer.from(JSON.stringify(order)));
      } catch (err) {
        console.warn('⚠️ RabbitMQ not connected. Skipping message...');
      }

      return order;
    },
  },
};
