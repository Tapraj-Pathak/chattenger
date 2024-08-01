require('dotenv').config()
const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const {createServer} = require('http');
const server = createServer(app);
const io = new Server(server);

const userModel = require('./models/user-model');

const {connectToDB} = require('./configs/connection');

const indexRoute = require('./routes/index');

connectToDB();

const PORT = process.env.PORT;

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/',indexRoute);

io.on('connection', (socket) => {
    socket.on('chat message',async (msg) => {
        
        io.emit('chat message', msg);
    });
});

server.listen(PORT);