import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการเข้าสู่ระบบ
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ส่งข้อมูลไปที่ API ของ Strapi
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password: password,
      });

      const token = response.data.jwt;
      sessionStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('Login successful');
      console.log(response.data);

      // เปลี่ยนหน้าไปที่หน้าเกม
      navigate('/mode');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message[0].messages[0].message);
      } else {
        setError('An error occurred while logging in.');
      }
    }
  };

  // ฟังก์ชันสำหรับการไปที่หน้าสมัครสมาชิก
  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url(/777.gif)',  
        backgroundSize: 'cover',          
        backgroundPosition: 'center',     
        backgroundRepeat: 'no-repeat',    
        position: 'relative',             
        height: '100vh',                   
      }}
    >
      <div style={{ width: '500px', textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '20px', borderRadius: '15px' }}>
        <h2 className="text-light" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>
          เข้าสู่ระบบ
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>} {/* แสดงข้อความผิดพลาด */}

          <button type="submit" className="btn btn-success w-100 py-3" style={{ fontSize: '1.7rem', borderRadius: '12px' }}>
            เข้าสู่ระบบ
          </button>
        </form>

        {/* ข้อความสำหรับผู้ที่ยังไม่มีบัญชี */}
        <div className="mt-3">
          <p className="text-light">
            ยังไม่มีบัญชี?{' '}
            <button onClick={handleSignUpClick} className="text-blue-500 hover:underline">
              คลิกที่นี่เพื่อสมัครสมาชิก
            </button>
          </p>
        </div>
        <div className="mt-3">
          <p className="text-light">
            หรือ{' '}
            <button onClick={() => navigate('/mode')} className="text-blue-500 hover:underline">
              เข้าเล่นโดยไม่เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
