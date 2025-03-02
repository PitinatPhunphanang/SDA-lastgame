import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SinglePlayerGame() {
  const navigate = useNavigate();
  const location = useLocation();  // ใช้ location เพื่อดึง state
  const [time, setTime] = useState(location.state?.time * 60 || 0);  // แปลงจากนาทีเป็นวินาที
  const [points, setPoints] = useState(0);  // คะแนน
  const [gameInterval, setGameInterval] = useState(null);  // Interval สำหรับการนับเวลา
  const [gameOver, setGameOver] = useState(false);  // สถานะเกมจบ
  const [showExitModal, setShowExitModal] = useState(false);  // สถานะการแสดง Modal

  // ฟังก์ชันออกจากเกม
  const handleExitGame = () => {
    navigate('/');  // เมื่อกดออกจากเกม จะกลับไปหน้า Home
  };

  // ฟังก์ชันแสดงคำใบ้
  const handleHint = () => {
    alert('คำใบ้: คิดดีๆครับพี่');
  };

  // เริ่มต้นนับเวลา
  useEffect(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }

    if (time > 0) {
      const interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setGameOver(true);  // เมื่อหมดเวลา จะจบเกม
          }
          return prevTime - 1;
        });
      }, 1000);  // นับเวลา 1 วินาที

      setGameInterval(interval);

      // ทำความสะอาด interval เมื่อ Component ถูกทำลาย
      return () => clearInterval(interval);
    }
  }, [time]);

  // ฟังก์ชันแปลงเวลาให้อยู่ในรูปแบบ "00:00"
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // ฟังก์ชันเปิด/ปิด modal เมื่อคลิกที่ไอคอนออก
  const handleShowExitModal = () => {
    clearInterval(gameInterval); // หยุดเวลา
    setShowExitModal(true);  // แสดง modal
  };

  const handleContinueGame = () => {
    // เริ่มนับเวลาต่อ
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setGameOver(true);  // เมื่อหมดเวลา จะจบเกม
        }
        return prevTime - 1;
      });
    }, 1000);

    setGameInterval(interval);
    setShowExitModal(false);  // ซ่อน modal
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);  // ซ่อน modal และออกจากเกม
    navigate('/');
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
      {/* ข้อมูลเวลาและคะแนน */}
      <div className="position-absolute" style={{ top: '20px', left: '20px', fontSize: '1.5rem', color: 'white' }}>
        <div>เวลา {formatTime(time)} นาที</div>
        <div>คะแนน: {points}</div>
      </div>

      {/* ไอคอนโปรไฟล์ */}
      <div className="position-absolute" style={{ top: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}>
        <i className="bi bi-person-circle"></i>
      </div>

      {/* ไอคอนออกเกม */}
      <div 
        className="position-absolute" 
        style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}
        onClick={handleShowExitModal}
      >
        <i className="bi bi-door-open"></i> {/* ไอคอนออกเกม */}
      </div>

      {/* ไอคอนคำใบ้ */}
      <div 
        className="position-absolute" 
        style={{ bottom: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}
        onClick={handleHint}
      >
        <i className="bi bi-lightbulb"></i> {/* ไอคอนคำใบ้ */}
      </div>

      {/* เกมกลาง */}
      <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', color: 'white' }}>
        <div>
          {gameOver ? (
            <div>
              <h3>หมดเวลา!</h3>
              <div>คะแนน: {points}</div>
              <button className="btn btn-danger mt-3" onClick={handleExitGame}>ออกจากเกม</button>
            </div>
          ) : (
            <div>เกมคนเดียว</div>
          )}
        </div>
      </div>

      {/* Modal ถามยืนยันการออกจากเกม */}
      {showExitModal && (
        <div className="modal d-block" style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="modal-dialog d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="modal-content" style={{ width: '400px', padding: '20px', backgroundColor: 'white' }}>
              <h4>คุณต้องการออกจากเกมหรือไม่?</h4>
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-success" onClick={handleContinueGame}>เล่นต่อ</button>
                <button className="btn btn-danger" onClick={handleConfirmExit}>ออก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SinglePlayerGame;
