
// ✅ email-service/rabbitmq/connection.js
const amqp = require("amqplib");
let channel;

async function connectRabbitMQ(onMessage) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  channel = await connection.createChannel();

  await channel.assertQueue("order_created", {
    durable: true,
  });

  console.log("\u2705 RabbitMQ connected (email-service)");

  channel.consume(
    "order_created",
    async (msg) => {
      try {
        const orderData = JSON.parse(msg.content.toString());
        console.log("\ud83d\udce5 Received order:", orderData);

        await onMessage(orderData);

        channel.ack(msg);
      } catch (err) {
        console.error("\u274c Email processing failed:", err.message);
        // Message will stay in queue and be retried later
      }
    },
    { noAck: false }
  );
}

module.exports = { connectRabbitMQ };
