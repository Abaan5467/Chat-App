const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const notifier = require('node-notifier');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', (socket) => {
    socket.on('create-user', (username) => {
        if (users.some(user => user.username === username)) {
            socket.emit('username-exists', { message: 'Username Already Exists!' });
        } else {
            users.push({ id: socket.id, username: username });
            io.emit('user-list', users.map(user => user.username));
        }
    });

    socket.on('message-sent', (data) => {
        io.emit('chatMessage', data);
    });

    socket.on('private', (data) => {
        const [from, to, msg] = data;
        const recipient = users.find(user => user.username === to).id;
        io.to(recipient).emit('private-message', [msg, from]);
    });

    socket.on('maximized', (data) => {
        const [user, isMaximized, isPrivate, from] = data;

        if (!isMaximized) {
            notifier.notify({
                title: 'Message',
                message: `${user}, You have a new ${isPrivate ? 'private ' : ''}message from ${from}!`,
                sound: true,
                wait: true
            });
        }
    });

    socket.on('disconnect', () => {
        const userIndex = users.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            const username = users[userIndex].username;
            users.splice(userIndex, 1);
            io.emit('user-list', users.map(user => user.username));
            io.emit('userDisconnected', username);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
