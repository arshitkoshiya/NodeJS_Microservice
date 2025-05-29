// user-service/rabbitmq/connection.js
const amqp = require('amqplib');

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('get_user_data');
  console.log('✅ User Service: RabbitMQ connected');

  channel.consume('get_user_data', async (msg) => {
    const { userId, correlationId, replyTo } = JSON.parse(msg.content.toString());

    const User = require('../models/User');
    const user = await User.findById(userId);

    const response = {
      name: user?.name,
      email: user?.email,
    };

    console.log('📤 Responding with user data:', response);

    channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(response)), {
      correlationId,
    });

    channel.ack(msg);
  });
}

module.exports = connectRabbitMQ;
