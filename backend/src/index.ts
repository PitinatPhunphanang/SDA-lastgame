import type { Core } from '@strapi/strapi';
import { Server as SocketIOServer } from 'socket.io';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const io = new SocketIOServer(strapi.server.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    const users = new Map(); // เก็บข้อมูลผู้ใช้

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);
      (strapi as any).io = io;

      // รับชื่อผู้ใช้จาก Client
      socket.on('register', (username) => {
        users.set(socket.id, username);
        console.log(`User ${username} registered with socket ID ${socket.id}`);

        // แจ้งทุกคนว่ามีผู้ใช้ใหม่เข้ามา
        io.emit('systemMessage', `${username} has connected`);
      });

      // รับข้อความจาก Client และส่งกลับไปยังทุกคน
      socket.on('message', (text) => {
        const username = users.get(socket.id);
        if (username) {
          io.emit('message', { username, text });
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);

        // แจ้งทุกคนว่ามีผู้ใช้ออกไป
        const username = users.get(socket.id);
        if (username) {
          io.emit('systemMessage', `${username} has disconnected`);
        }

        // ลบผู้ใช้ออกจาก Map เมื่อตัดการเชื่อมต่อ
        users.delete(socket.id);
      });
    });
  },
};