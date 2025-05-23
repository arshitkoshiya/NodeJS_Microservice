const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: String,
  product: String,
  amount: Number,
});

module.exports = mongoose.model('Order', OrderSchema);
