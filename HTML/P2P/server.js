const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" } // Allows connections from other PCs
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 1. Host creates a room
  socket.on('host-request', () => {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    socket.join(token);
    socket.emit('token-generated', token);
    console.log(`Room created with Token: ${token}`);
  });

  // 2. Joiner tries to enter
socket.on('chat-message', (msg) => {
    const div = document.createElement('div');
    div.style.padding = "5px 0";
    // Check if it's a system message
    if (msg.startsWith('System:')) {
        div.className = 'system-msg';
    }
    div.innerText = msg;
    const msgBox = document.getElementById('messages');
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight; // Auto-scroll to bottom
});

  // 3. Handle Messages
  socket.on('send-chat', (data) => {
    io.to(data.token).emit('chat-message', data.message);
  });
});

http.listen(5500, () => {
  console.log('Server running on http://localhost:5500');
});