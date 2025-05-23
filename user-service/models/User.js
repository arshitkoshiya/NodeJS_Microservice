// user-service/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  orders: [String] // ✅ Add this line
});

module.exports = mongoose.model('User', UserSchema);
