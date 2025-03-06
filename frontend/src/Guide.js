import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';

function Guide() {
  const navigate = useNavigate();

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
        
        <div style={{ width: '500px', textAlign: 'center', backgroundColor: 'rgba(172, 172, 172, 0.6)', padding: '20px', borderRadius: '15px' }}>
        <div className="d-flex justify-content-center align-items-center mb-4">
            <h2 className="text-light" style={{ fontSize: '1.5rem', fontFamily: 'Georgia, serif', animation: 'fadeIn 2s ease-in-out', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <span style={{ marginBottom: '5px' }}>คำอธิบายและข้อแนะนำในการเล่นเกม</span>
            </h2>
        </div>

        <div className="text-light" style={{ fontSize: '1rem', marginBottom: '20px', textAlign: 'left', paddingLeft: '20px' }}>
            <p>1. กดปุ่ม 'เริ่ม' เพื่อเข้าสู่เกม โดยจะมีเวลาเล่นจำกัดอยู่ที่ 2 นาที</p>
            <p>2. หากทำการล็อกอิน ระบบจะบันทึกคะแนนของคุณไปยังบอร์ดกระดานผู้นำ</p>
            <p>3. หากไม่ได้ทำการล็อกอิน คุณจะสามารถเล่นได้ แต่คะแนนของคุณจะไม่ถูกบันทึก</p>
            <p>4. คุณสามารถใช้งานแชทโลกได้ โดยกดที่ไอคอนโลก</p>
            <p>5. คุณสามารถตรวจสอบกระดานผู้นำได้ โดยกดไอคอนถ้วยรางวัล</p>
        </div>
    </div>

      {/* ไอคอนโปรไฟล์ */}
      <div
        className="position-absolute"
        style={{
          top: '20px',
          right: '20px',
          fontSize: '2.5rem',
          zIndex: 2,
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/Profile')}
      >
        <i className="bi bi-person-circle"></i>
      </div>


      <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <i className="bi bi-house"></i> 
      </div>

    </div>
  );
}

export default Guide;