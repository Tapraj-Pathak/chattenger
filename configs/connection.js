const mongoose = require('mongoose');

// Connect to MongoDB
function connectToDB(){
    return mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
  
}

module.exports = {
    connectToDB
}