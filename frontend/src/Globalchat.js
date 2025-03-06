import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import conf from './conf/main';

function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleGoHome = () => navigate('/');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await axios.get(`${conf.apiUrlPrefix}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!username) return;

    const newSocket = io(`${conf.url}`);
    setSocket(newSocket);

    // ส่งชื่อผู้ใช้ไปยัง Server เมื่อเชื่อมต่อ
    newSocket.emit('register', username);

    // รับข้อความจาก Server
    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // รับข้อความระบบ (system messages) จาก Server
    newSocket.on('systemMessage', (message) => {
      setMessages((prev) => [...prev, { text: message, isSystem: true }]);
    });

    return () => newSocket.disconnect();
  }, [username]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && socket) {
      socket.emit('message', inputMessage);
      setInputMessage('');
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
              {message.isSystem ? (
                <em className="text-muted">{message.text}</em> // ข้อความระบบ
              ) : (
                <div>
                  <strong>{message.username}:</strong> {message.text}
                </div>
              )}
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
        <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={handleGoHome}>
          <i className="bi bi-house"></i>
        </div>
      </div>
    </div>
  );
}

export default GlobalChat;