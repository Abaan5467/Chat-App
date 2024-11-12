const socket = io();
const displayMessage = document.getElementsByClassName('display-message')[0];
const messageList = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('sendMessage');
const userInput = document.getElementById('username');
const users = document.getElementsByClassName('people-list')[0];
const to = document.getElementById('to');

const convertTo12HourFormat = (timeStr) => {
    const [hour, minute, secondMs] = timeStr.split(":");
    const [second, ms] = secondMs.split(".");
    let hours = parseInt(hour, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}.${ms} ${period}`;
};

const sendMessageHandle = () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('message-sent', [message, username]);
    }
    messageInput.value = '';
};

const addMessage = (data, isPrivate) => {
    const date = new Date();
    const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const current24Time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
    const currentTime = convertTo12HourFormat(current24Time);
    const [msg, user] = data;
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = `${currentDate}  ${currentTime}`;
    span.classList.add('time-date');
    li.classList.add('message-li');

    if (isPrivate && user != username) {
        li.style.backgroundColor = 'grey';
        li.appendChild(document.createTextNode(`${user} (Private) : ${msg}`));
    } else if (isPrivate && user === username) {
        li.style.backgroundColor = 'grey';
        li.appendChild(document.createTextNode(`${user} (You) (Private) : ${msg}`));
    } else if (!isPrivate && user === username) {
        li.appendChild(document.createTextNode(`${user} (You) : ${msg}`));
    } else if (!isPrivate && user !== username) {
        li.appendChild(document.createTextNode(`${user} : ${msg}`));
    }

    li.appendChild(span);
    messageList.appendChild(li);
};

const isMaximized = () => {
    return document.hasFocus();
};

let username;
const option = document.createElement('option');
option.setAttribute('value', 'everyone');
option.textContent = 'Everyone';
to.appendChild(option);

document.querySelectorAll('form')[0].addEventListener('submit', (e) => {
    e.preventDefault();
    username = userInput.value;
    if (username) {
        socket.emit('create-user', username);
    }
    
    document.getElementsByClassName('form-container')[0].style.display = 'none';
    displayMessage.style.marginTop = '0px';
    displayMessage.style.display = 'block';
    displayMessage.style.height = '80%';
    messageInput.disabled = !messageInput.disabled;
});

sendButton.addEventListener('click', () => {
    if (to.value === 'everyone') {
        sendMessageHandle();
    } else {
        socket.emit('private', [username, to.value, messageInput.value]);
        addMessage([messageInput.value, username], true);
    }
});

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (to.value === 'everyone') {
            sendMessageHandle();
        } else {
            socket.emit('private', [username, to.value, messageInput.value]);
            addMessage([messageInput.value, username], true);
        }
    }
});

socket.on('chatMessage', (data) => {
    addMessage(data, false);
    socket.emit('maximized', [userInput.value, isMaximized(), false, data[1]]);
});

socket.on('private-message', (data) => {
    addMessage(data, true);
    socket.emit('maximized', [userInput.value, isMaximized(), true, data[1]]);
});

socket.on('user-list', (userList) => {
    users.innerHTML = '';
    to.innerHTML = '<option value="everyone">Everyone</option>';
    userList.forEach(user => {
        if (user !== username) {
            const option = document.createElement('option');
            option.setAttribute('value', user);
            option.textContent = user;
            to.appendChild(option);
        }

        const li = document.createElement('li');
        li.classList.add('person');
        li.textContent = user + (user === username ? ' (You)' : '');
        users.appendChild(li);
    });
});

socket.on('username-exists', (data) => {
    document.getElementsByClassName('form-container')[0].style.display = 'flex';
    displayMessage.style.display = 'none';
    messageInput.disabled = !messageInput.disabled;
    document.getElementById('error-message').textContent = data.message;
    document.getElementById('error-message').style.color = 'red';
    document.getElementById('error-message').style.display = 'block';
});
