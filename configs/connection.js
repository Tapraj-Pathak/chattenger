const mongoose = require('mongoose');

// Connect to MongoDB
function connectToDB(){
    return mongoose.connect('mongodb://localhost:27017/chat-app')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
  
}

module.exports = {
    connectToDB
}