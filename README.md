# Socket.IO Chat Application

This is a simple chat application built using `Express`, `Socket.IO`, and `Node.js`. It allows real-time communication between users through web sockets.

## Features
- Users can send messages in real-time.
- Users receive desktop notifications when a new message is received and the chat window is not in focus.
- Users can see the names of the users who are currently online.
-Users can send private messages to other users.

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v12 or higher)

## Installation

1. Clone the repository or download the project files.

```bash
git clone https://github.com/Abaan5467/Chat-App/
```

2. Navigate into the project directory:

```bash
cd <project-directory>
```

3. Install the required dependencies:

```bash
npm install
```

4. Start the server by running the following command:

```bash
npm start
```

5. Open your browser and navigate to:

```arduino
http://localhost:3000
```

## Accessing the Application from Other Devices

To access this application from other devices on the same local network:

### Find your local IP address:

- **On Windows**, open the Command Prompt and run:

    ```bash
    ipconfig
    ```
    Look for the `IPv4 Address` under your network connection.

- **On macOS/Linux**, open the Terminal and run:

    ```bash
    ifconfig
    ```
    Look for the `inet` address under your active network connection.

Once you have your local IP address (e.g., `192.168.1.10`), replace `localhost` in the URL with your IP address and the same port number (default: `3000`):

```arduino
http://192.168.1.10:3000
```
