// const User = require('../models/User');
// const { getChannel } = require('../rabbitmq/connection');

// module.exports = {
//   Query: {
//     users: async () => await User.find(),
//   },
//   Mutation: {
//     createUser: async (_, { name }) => {
//       const user = await User.create({ name });

//       const channel = getChannel();
//       channel.sendToQueue('user_created', Buffer.from(JSON.stringify(user)));

//       return user;
//     },
//   },
// };


const User = require("../models/User");
const { getChannel } = require("../rabbitmq/connection");

module.exports = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email }); // Mongoose or in-memory
      await user.save();
      return user;
    },
  },
};
