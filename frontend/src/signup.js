import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import conf from './conf/main';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการสมัครสมาชิก
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // ส่งข้อมูลไปที่ API ของ Strapi สำหรับการสมัครสมาชิก
      const response = await axios.post(`${conf.apiUrlPrefix}/auth/local/register`, {
        username: name,
        email: email,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('User created:', response.data);

      const pulltoken = await axios.post(`${conf.apiUrlPrefix}/auth/local`, {
        identifier: email,
        password: password,
      });
      const token = pulltoken.data.jwt;
      sessionStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('Login successful');
      // ถ้าสมัครสำเร็จ เปลี่ยนหน้าไปที่หน้าเกม
      navigate('/mode');
    } catch (error) {
      console.error('There was an error registering the user:', error);
      alert('สมัครสมาชิกไม่สำเร็จ');
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
        position: 'relative',             
        height: '100vh',                   
      }}
    >
      <div style={{ width: '500px', textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '20px', borderRadius: '15px' }}>
        <h2 className="text-light" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>
          สมัครสมาชิก
        </h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="ชื่อ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn btn-success w-100 py-3" style={{ fontSize: '1.7rem', borderRadius: '12px' }}>
            สมัครสมาชิก
          </button>
        </form>

        {/* ข้อความด้านล่าง */}
        <div className="mt-3">
          <p className="text-light">
            มีบัญชีแล้ว?{' '}
            <button onClick={() => navigate('/Signin')} className="text-blue-500 hover:underline">
              คลิกที่นี่เพื่อเข้าสู่ระบบ
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

export default SignUp;
