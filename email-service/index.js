require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars").default;

// import hbs from "nodemailer-express-handlebars";
const path = require("path");
const { connectRabbitMQ } = require("./rabbitmq/connection");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Use the exphbs (express-handlebars for nodemailer) middleware
transporter.use(
  "compile",
  hbs({
    // Pass the options directly to the exphbs function
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./templates"),
      defaultLayout: false,
      layoutsDir: path.resolve("./templates"), // Often needed for layouts
    },
    viewPath: path.resolve("./templates"),
    extName: ".hbs",
  })
);

// Email sender
async function sendOrderEmail(order) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: order.email, // must come from order data
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
    console.log("📧 Order email sent to", order.email);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
}

// Start consumer
connectRabbitMQ(sendOrderEmail);
