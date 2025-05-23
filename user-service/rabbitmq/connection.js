const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('user_created');
  console.log('User Service: RabbitMQ Connected');
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
