import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios'; // นำเข้า axios
import 'bootstrap/dist/css/bootstrap.min.css';

function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState(''); // State สำหรับเก็บชื่อผู้ใช้

  // ดึงข้อมูลผู้ใช้จาก Strapi API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // รับ JWT token จาก localStorage
        const response = await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ไปกับ header
          },
        });
        setUsername(response.data.username); // ตั้งค่าชื่อผู้ใช้
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  // เชื่อมต่อ Socket เมื่อ Component ถูกโหลด
  useEffect(() => {
    const newSocket = io('http://localhost:8080');
    setSocket(newSocket);

    // ส่งชื่อผู้ใช้ไปยัง Server เมื่อเชื่อมต่อ
    if (username) {
      newSocket.emit('register', username);
    }

    // รับข้อความจาก Server
    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => newSocket.disconnect(); // ตัดการเชื่อมต่อเมื่อ Component Unmount
  }, [username]); // เรียก useEffect ใหม่เมื่อ username เปลี่ยนแปลง

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      socket.emit('message', inputMessage); // ส่งข้อความไปยัง Server
      setInputMessage(''); // ล้างช่องพิมพ์ข้อความ
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url(/777.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-dark text-light p-4 rounded-3"
        style={{ width: '70%', textAlign: 'center' }}
      >
        <h2 className="mb-4" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif' }}>
          Global Chat
        </h2>

        {/* ส่วนแสดงข้อความ */}
        <div
          className="bg-light text-dark p-3 rounded-3 mb-3"
          style={{ height: '400px', overflowY: 'auto' }}
        >
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              {message}
            </div>
          ))}
        </div>

        {/* ส่วนพิมพ์ข้อความ */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>

        {/* ลิงค์ไปหน้าหลัก */}
        <div className="position-absolute" style={{ bottom: '20px', left: '20px' }}>
          <a href="/" className="text-white fs-1">
            🏠
          </a>
        </div>
      </div>
    </div>
  );
}

export default GlobalChat;