//Mode.js

import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button } from 'react-bootstrap';  // ใช้ React-Bootstrap สำหรับ Modal

function ModeSelection() {
  const navigate = useNavigate();
  const [time, setTime] = useState(1);  // ตั้งค่าเริ่มต้นเวลาเป็น 1 นาที
  const [timeDisplay, setTimeDisplay] = useState("1 นาที");
  const [showModal, setShowModal] = useState(false);  // สถานะของ Modal

  // ฟังก์ชันไปยังหน้า Home
  const handleGoHome = () => {
    navigate('/');  // เมื่อกดไอคอนบ้าน จะกลับไปที่หน้า Home
  };

    const handleMatching = () => {
    navigate('/matching');  // เมื่อกด 1 v 1 จะไปหน้า Matching
  };

  // ฟังก์ชันเปิด/ปิด Modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // ฟังก์ชันเลือกเวลา
  const handleSelectTime = (selectedTime) => {
    setTime(selectedTime);
    setTimeDisplay(`${selectedTime} นาที`);
    handleCloseModal();  // ปิด modal หลังจากเลือกเวลา
  };

  // ฟังก์ชันไปยังหน้า Solo และส่งค่าเวลา
  const handleSoloGame = () => {
    navigate('/solo', { state: { time: time } });  // ส่งเวลาที่กรอกไปหน้า Solo.js
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
      <div 
        style={{
          width: '500px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2 className="text-dark mb-4">โหมด</h2>

        <div className="d-flex mb-3" style={{ gap: '10px', width: '100%' }}>
          {/* ปุ่มเล่นคนเดียว */}
          <button className="btn btn-secondary py-3" style={{ fontSize: '1.5rem', width: '100%', borderRadius: '10px' }} onClick={handleSoloGame}>
            เล่นคนเดียว
          </button>

          {/* ปุ่มนาฬิกา */}
          <button 
            className="btn btn-warning py-3 d-flex justify-content-center align-items-center position-relative" 
            style={{ fontSize: '1.5rem', width: '20%', borderRadius: '10px' }}
            onClick={handleShowModal}  // เปิด Modal เมื่อคลิก
          >
            <i className="bi bi-clock me-2"></i>
            {/* แสดงเวลาเล็กๆใต้ปุ่ม */}
            <div 
              style={{
                position: 'absolute',
                bottom: '-25px',  // ให้แสดงเวลาต่ำกว่าปุ่ม
                fontSize: '1rem',  // ขนาดตัวอักษรเล็กลง
                color: 'black',
              }}
            >
              {timeDisplay}
            </div>
          </button>
        </div>

        <div className="d-flex justify-content-center mt-2 mb-3" style={{ width: '100%' }}>
          <button className="btn btn-success py-3" style={{ fontSize: '1.5rem', width: '100%', borderRadius: '10px' }} onClick={handleMatching}>
            1 v 1
          </button>
        </div>
        
        {/* ปุ่มสร้างห้อง */}
        <div className="position-relative" style={{ width: 'auto', marginTop: '5px' }}>
          <button className="btn btn-dark py-2 d-flex justify-content-center align-items-center" style={{ fontSize: '0.875rem', height: '45px', width: '170px', borderRadius: '0px' }}>
            สร้างห้อง
          </button>

          {/* ไอคอนประวัติการเล่น */}
          <i className="bi bi-clock-history position-absolute" style={{ fontSize: '2rem', color: 'white', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }}></i>
        </div>
      </div>

      {/* ไอคอนกลับหน้าแรก */}
      <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={handleGoHome}>
        <i className="bi bi-house"></i> 
      </div>

      {/* Modal สำหรับเลือกเวลา */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>เลือกเวลา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            <Button variant="primary" onClick={() => handleSelectTime(1)}>
              1 นาที
            </Button>
            <Button variant="primary" onClick={() => handleSelectTime(5)} className="mt-2">
              5 นาที
            </Button>
            <Button variant="primary" onClick={() => handleSelectTime(10)} className="mt-2">
              10 นาที
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModeSelection;
