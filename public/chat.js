const socket = io();

document.getElementById('sendButton').addEventListener('click', () => {
    const message = document.getElementById('messageInput').value;
    if (message) {
        socket.emit('chatMessage', message);
        document.getElementById('messageInput').value = '';
    }
});

socket.on('chatMessage', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    document.getElementById('messages').appendChild(li);
});
