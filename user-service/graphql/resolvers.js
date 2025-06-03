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

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  Query: {
    users: async () => await User.find(),
  },

  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      await user.save();
      return user;
    },

    login: async (_, { email }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, user };
    }
  }
};