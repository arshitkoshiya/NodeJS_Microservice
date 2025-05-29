const amqp = require("amqplib");
let channel;

async function connectRabbitMQ(onMessage) {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue("order_created");
  console.log("✅ RabbitMQ connected (email-service)");

  channel.consume("order_created", async (msg) => {
    const orderData = JSON.parse(msg.content.toString());
    console.log("📥 Received order:", orderData);

    await onMessage(orderData); // Call handler
    channel.ack(msg); // Acknowledge the message
  });
}

module.exports = { connectRabbitMQ };
