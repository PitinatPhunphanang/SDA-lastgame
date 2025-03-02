import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css"; // ใช้ไอคอนจาก Bootstrap Icons

function Matching() {
  const navigate = useNavigate();  // ใช้ navigate สำหรับการเปลี่ยนหน้า
  const [timeCount, settimeCount] = useState(0); //นับเวลาที่ 0
  const [matched, setMatched] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (timeCount >= 0 && !matched) {
      const timer = setTimeout(() => settimeCount(timeCount + 1), 1000);
      return () => clearTimeout(timer);
    } 
  }, [timeCount, matched]);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  const handleCancel = () => {
    navigate('/mode');
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
      <div style={{
          width: '500px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <h3 className="mb-3">กำลังจับคู่{dots}</h3>
        <div className="d-flex justify-content-around align-items-center mb-3">
          <div>
            <i className="bi bi-person-circle" style={{ fontSize: "5rem" }}></i>
            <p>คุณ</p>
          </div>
          <h4 style={{ margin: '0 50px' }}>VS</h4>
          <div>
            <i className="bi bi-question-circle" style={{ fontSize: "5rem" }}></i>
            <p>...</p>
          </div>
        </div>
        <button className="btn btn-danger mb-3" onClick={handleCancel}>
          ยกเลิกการจับคู่
        </button>
        <div className="d-flex justify-content-center align-items-center">
          <p className="ms-2">กำลังรอผู้เล่นคนอื่น <b>{timeCount}</b> วินาที</p>
        </div>
      </div>
    </div>
  );
}

export default Matching;
