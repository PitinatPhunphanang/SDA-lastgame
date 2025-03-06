import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // นำเข้า useNavigate
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';

function Home() {
  const [showModal, setShowModal] = useState(false); // ใช้สำหรับเปิดป๊อปอัพ
  const [showStartButton, setShowStartButton] = useState(true); // สำหรับซ่อนปุ่มเริ่ม
  const navigate = useNavigate();  // ใช้ navigate สำหรับการเปลี่ยนหน้า
  // ฟังก์ชันเมื่อกดเริ่มเกม
  const handleStart = () => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      navigate("/Mode"); // ถ้าล็อกอินอยู่แล้ว ไปที่ Mode ทันที
    } else {
      setShowModal(true);
      setShowStartButton(false);
    }
  };

  const handleLogin = () => {
    const token = sessionStorage.getItem("authToken"); // ดึง JWT จาก sessionStorage
  if (token) {
    navigate("/Mode"); // ถ้า login แล้ว ไปที่หน้า Mode เลย
  } else {
    setShowModal(false); // ปิดป๊อปอัพ
    navigate('/Signin'); // ไปที่หน้า Login
  }
  };

  const handleNoLogin = () => {
    sessionStorage.removeItem("authToken"); // ลบ JWT ออกจาก sessionStorage
    setShowModal(false); // ปิดป๊อปอัพ
    navigate('/Mode'); // ไปที่หน้าเกมโดยไม่ล็อกอิน
  };

  const handleExit = () => {
    window.close(); // คำสั่งในการปิดหน้าเว็บ
  };

  const handleProfileClick = () => {
      navigate('/Profile'); // ถ้าล็อกอินแล้วไปที่หน้าโปรไฟล์
  };

  const handleGuideClick = () => {
    navigate('/Guide'); // เปลี่ยนไปที่หน้าคู่มือ
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

        <div className="d-flex justify-content-center align-items-center mb-4">
          <h2 className="text-light" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', animation: 'fadeIn 2s ease-in-out', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <span style={{ marginBottom: '5px' }}>Da Vinci Mystery</span>
            <span>Game</span>
          </h2>
        </div>

        <div className="mb-4">
          <img src="/888.gif" alt="GIF" style={{ width: '40%', maxWidth: '120px', margin: '2 auto' }} />
        </div>

        <div className="d-flex flex-column justify-content-center align-items-center">
          {showStartButton && (
            <button
              className="btn btn-primary mb-3 py-3"
              style={{ fontSize: '1.7rem', zIndex: 1, width: '60%', borderRadius: '12px', boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)', animation: 'bounce 1s infinite' }}
              onClick={handleStart}  // เมื่อกดปุ่ม เริ่ม จะเปิดป๊อปอัพ
            >
              เริ่ม
            </button>
          )}

          <button
            className="btn btn-danger mb-3 py-3"
            style={{ fontSize: '1.7rem', zIndex: 1, width: '60%', borderRadius: '12px', boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)', animation: 'bounce 1s infinite' }}
            onClick={handleExit}
          >
            ออก
          </button>
        </div>
      </div>

      {/* ป๊อปอัพ */}
      {showModal && (
        <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '9999' }}>
          <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', width: '400px', margin: 'auto', position: 'relative', top: '40%' }}>
            <h4>คุณจะเล่นเกมแบบล็อกอินหรือไม่?</h4>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success" style={{ marginRight: '20px', width: '150px' }} onClick={handleLogin}>ล็อกอิน</button>
              <button className="btn btn-danger" style={{ width: '150px' }} onClick={handleNoLogin}>ไม่ล็อกอิน</button>
            </div>
          </div>
        </div>
      )}

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
        onClick={handleProfileClick}  // คลิกไอคอนโปรไฟล์
      >
        <i className="bi bi-person-circle"></i>
      </div>

      {/* ไอคอนคู่มือ (บนซ้าย) */}
      <div
        className="position-absolute"
        style={{
          top: '20px',
          left: '20px',
          fontSize: '2.5rem',
          zIndex: 2,
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={handleGuideClick}
      >
        <i className="bi bi-question-circle"></i>
      </div>

      {/* ไอคอนการตั้งค่า (ล่างซ้าย) */}
      {/*<div
        className="position-absolute"
        style={{
          bottom: '20px',
          left: '20px',
          fontSize: '2.5rem',
          zIndex: 2,
          color: 'white',
          cursor: 'pointer'
        }}
        //onClick=
      >
        <i className="bi bi-gear"></i>
      </div>*/}
    </div>
  );
}

export default Home;
