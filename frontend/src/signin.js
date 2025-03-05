import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import conf from './conf/main';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชันคำนวณเวลาบล็อกตามจำนวนครั้งที่ล็อกอินผิดพลาด
  const calculateBlockTime = (attempts) => {
    if (attempts === 5) return 1 * 60 * 1000; // 1 นาที
    if (attempts === 6) return 5 * 60 * 1000; // 5 นาที
    if (attempts >= 7) return 10 * 60 * 1000; // 10 นาที
    return 0; // ไม่บล็อก
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      navigate('/mode');
    }

    // โหลดข้อมูลจาก localStorage
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedBlocked = localStorage.getItem('isBlocked');
    const storedBlockTime = localStorage.getItem('blockTime');

    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }

    if (storedBlocked === 'true') {
      const currentTime = Date.now();
      const blockTime = parseInt(storedBlockTime);
      const timePassed = currentTime - blockTime;

      // คำนวณเวลาบล็อกที่เหลือ
      const remainingBlockTime = calculateBlockTime(loginAttempts) - timePassed;

      if (remainingBlockTime <= 0) {
        setIsBlocked(false);
        setLoginAttempts(0); // รีเซ็ตจำนวนครั้งที่ล็อกอินผิดพลาด
        localStorage.setItem('isBlocked', 'false');
        localStorage.setItem('blockTime', '');
        localStorage.setItem('loginAttempts', '0'); // ล้างจำนวนครั้งที่ล็อกอินผิดพลาด
      } else {
        setIsBlocked(true);
      }
    }

    // ตั้งค่า interval เพื่อตรวจสอบเวลาบล็อกทุกๆ วินาที
    const interval = setInterval(() => {
      const storedBlocked = localStorage.getItem('isBlocked');
      const storedBlockTime = localStorage.getItem('blockTime');

      if (storedBlocked === 'true') {
        const currentTime = Date.now();
        const blockTime = parseInt(storedBlockTime);
        const timePassed = currentTime - blockTime;

        // คำนวณเวลาบล็อกที่เหลือ
        const remainingBlockTime = calculateBlockTime(loginAttempts) - timePassed;

        if (remainingBlockTime <= 0) {
          setIsBlocked(false);
          setLoginAttempts(0); // รีเซ็ตจำนวนครั้งที่ล็อกอินผิดพลาด
          localStorage.setItem('isBlocked', 'false');
          localStorage.setItem('blockTime', '');
          localStorage.setItem('loginAttempts', '0'); // ล้างจำนวนครั้งที่ล็อกอินผิดพลาด
        }
      }
    }, 1000); // ตรวจสอบทุกๆ 1 วินาที

    // ทำความสะอาด interval เมื่อคอมโพเนนต์ถูกถอดออก
    return () => clearInterval(interval);
  }, [navigate, loginAttempts]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      setError('บัญชีของคุณถูกบล็อกชั่วคราว กรุณาลองใหม่ในภายหลัง');
      return;
    }

    try {
      const response = await axios.post(`${conf.apiUrlPrefix}/auth/local`, {
        identifier: email,
        password: password,
      });

      const token = response.data.jwt;
      sessionStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('Login successful');
      console.log(response.data);

      setLoginAttempts(0);
      localStorage.setItem('loginAttempts', 0);

      navigate('/mode');
    } catch (error) {
      console.error('Error:', error);

      const newLoginAttempts = loginAttempts + 1;
      setLoginAttempts(newLoginAttempts);
      localStorage.setItem('loginAttempts', newLoginAttempts);

      if (newLoginAttempts >= 5) {
        const blockTime = calculateBlockTime(newLoginAttempts);
        setIsBlocked(true);
        localStorage.setItem('isBlocked', 'true');
        const currentTime = Date.now();
        localStorage.setItem('blockTime', currentTime.toString());
        setError(`บัญชีของคุณถูกบล็อกชั่วคราว กรุณาลองใหม่ใน ${blockTime / (60 * 1000)} นาที`);
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }
  };

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
          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-success w-100 py-3" style={{ fontSize: '1.7rem', borderRadius: '12px' }}>
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-3">
          <p className="text-light">
            ยังไม่มีบัญชี?{' '}
            <button onClick={handleSignUpClick} className="btn btn-link text-light p-0">
              คลิกที่นี่เพื่อสมัครสมาชิก
            </button>
          </p>
        </div>
        <div className="mt-3">
          <p className="text-light">
            หรือ{' '}
            <button onClick={() => navigate('/mode')} className="btn btn-link text-light p-0">
              เข้าเล่นโดยไม่เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;