const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profileImage: {
    type: String,
    default: "/images/default.png"
  },
  messages: [{
    senderId: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  followers: []
},{timestamps: true});


const User = mongoose.model('user', schema);

module.exports = User;
