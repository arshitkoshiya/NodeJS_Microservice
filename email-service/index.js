//  email-service/index.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;
const path = require("path");
const { connectRabbitMQ } = require("./rabbitmq/connection");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./templates"),
      defaultLayout: false,
      layoutsDir: path.resolve("./templates"),
    },
    viewPath: path.resolve("./templates"),
    extName: ".hbs",
  })
);

async function sendOrderEmail(order) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: order.email,
    subject: "Order Confirmation",
    template: "orderConfirmed",
    context: {
      name: order.name,
      product: order.product,
      quantity: order.quantity,
      amount: order.amount,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("\ud83d\udce7 Order email sent to", order.email);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
}

connectRabbitMQ(sendOrderEmail);