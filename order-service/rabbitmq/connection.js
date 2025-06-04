//  order-service/rabbitmq.js
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

let channel;
let connection;

async function connectRabbitMQ() {
  connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();
  await channel.assertQueue("order_created", { durable: true });
  console.log("\u2705 RabbitMQ connected (order-service)");
}

function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}

async function getUserData(userId) {
  if (!connection) connection = await amqp.connect("amqp://localhost");
  const tempChannel = await connection.createChannel();
  const replyQueue = await tempChannel.assertQueue("", { exclusive: true });
  const correlationId = uuidv4();

  return new Promise((resolve, reject) => {
    tempChannel.consume(
      replyQueue.queue,
      async (msg) => {
        if (!msg) return;
        if (msg.properties.correlationId === correlationId) {
          const user = JSON.parse(msg.content.toString());
          resolve(user);
          await tempChannel.deleteQueue(replyQueue.queue);
          await tempChannel.close();
        }
      },
      { noAck: true }
    );

    tempChannel.sendToQueue(
      "get_user_data",
      Buffer.from(
        JSON.stringify({ userId, correlationId, replyTo: replyQueue.queue })
      ),
      {
        correlationId,
        replyTo: replyQueue.queue,
        persistent: true,
      }
    );
  });
}

module.exports = {
  connectRabbitMQ,
  getChannel,
  getUserData,
};
