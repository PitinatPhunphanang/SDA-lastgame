const conf = require('./main');
const http = require('http').createServer();
const io = require('socket.io')(http, {
  cors: { origin: '*' }, // อนุญาตให้ทุก origin เชื่อมต่อ
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // รับชื่อผู้ใช้จาก Client เมื่อเชื่อมต่อ
  socket.on('register', (username) => {
    socket.username = username; // เก็บชื่อผู้ใช้ใน socket object
    console.log(`${username} has joined the chat`);
    io.emit('message', `${username} has joined the chat`); // แจ้งเตือนทุกคน
  });

  // รับข้อความจาก Client
  socket.on('message', (message) => {
    if (socket.username) {
      const formattedMessage = `${socket.username}: ${message}`;
      console.log(formattedMessage);
      io.emit('message', formattedMessage); // ส่งข้อความไปยังทุกคน
    }
  });

  // เมื่อผู้ใช้ตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    if (socket.username) {
      console.log(`${socket.username} has left the chat`);
      io.emit('message', `${socket.username} has left the chat`); // แจ้งเตือนทุกคน
    }
  });
});

http.listen(8080, () => console.log(`Socket.IO server is running on http://localhost:8080`));