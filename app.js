require('dotenv').config();
const express = require('express');
const app = express();
const flash = require("connect-flash");
const path = require('path');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { createServer } = require('http');
const server = createServer(app);
const io = new Server(server);

const userModel = require('./models/user-model'); // Importing the user model
const { connectToDB } = require('./configs/connection');
const indexRoute = require('./routes/index');

connectToDB();

const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use('/', indexRoute);

io.on('connection', (socket) => {
    // Load messages when a user connects
    socket.on('user connected', async (userId) => {
        try {
            const user = await userModel.findById(userId);
            if (user && user.messages) {
                socket.emit('load messages', user.messages);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    });

    // Save new messages to the user document
    socket.on('chat message', async (msg) => {
        try {
            const user = await userModel.findById(msg.senderId);
            if (user) {
                const newMessage = {
                    senderId: msg.senderId,
                    senderUsername: user.username,
                    content: msg.content,
                    createdAt: new Date()
                };
                user.messages.push(newMessage);
                await user.save();
                io.emit('chat message', newMessage); // Emit the new message to all connected clients
            }
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
