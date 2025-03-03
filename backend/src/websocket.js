// src/websocket.js
const WebSocket = require('ws');

// สร้าง WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter((client) => client !== ws);
  });
});

// ฟังก์ชันสำหรับส่งข้อมูลไปยัง Client ทุกคน
function broadcast(data) {
  console.log('Broadcasting data:', data); // ตรวจสอบว่าข้อมูลถูกส่ง
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ส่งข้อมูลทุก 3 วินาที
setInterval(() => {
  const mockData = {
    type: 'testMessage',
    message: 'This is a test message from Strapi!',
    timestamp: new Date().toISOString(),
  };
  broadcast(mockData);
}, 10000);

module.exports = { broadcast };