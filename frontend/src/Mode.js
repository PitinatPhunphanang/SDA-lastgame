import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Button } from 'react-bootstrap';

function ModeSelection() {
  const navigate = useNavigate();
  const [time, setTime] = useState(2);  // เปลี่ยนค่าเริ่มต้นเป็น 2 นาที
  const [timeDisplay, setTimeDisplay] = useState("2 นาที");  // เปลี่ยนข้อความเริ่มต้นเป็น "2 นาที"
  const [showModal, setShowModal] = useState(false);

  const handleGoHome = () => navigate('/');
  const handleMatching = () => navigate('/matching');
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSelectTime = (selectedTime) => {
    setTime(selectedTime);
    setTimeDisplay(`${selectedTime} นาที`);
    handleCloseModal();
  };
  const handleSoloGame = () => navigate('/solo', { state: { time: time } });
  const handleGoLeaderboard = () => navigate('/Leaderboard');
  const handleProfileClick = () => navigate('/Profile');
  

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
          <button className="btn btn-secondary py-3" style={{ fontSize: '1.5rem', width: '100%', borderRadius: '10px' }} onClick={handleSoloGame}>
            เล่นคนเดียว
          </button>
          <button 
            className="btn btn-warning py-3 d-flex justify-content-center align-items-center position-relative" 
            style={{ fontSize: '1.5rem', width: '20%', borderRadius: '10px' }}
            onClick={handleShowModal}
          >
            <i className="bi bi-clock me-2"></i>
            <div 
              style={{
                position: 'absolute',
                bottom: '-25px',
                fontSize: '1rem',
                color: 'black',
              }}
            >
              {timeDisplay}
            </div>
          </button>
        </div>
      </div>

      <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={handleGoHome}>
        <i className="bi bi-house"></i> 
      </div>

      <div 
        className="position-absolute" 
        style={{ bottom: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}
        onClick={handleGoLeaderboard}
      >
        <i className="bi bi-trophy"></i>
      </div>

      <div 
        className="position-absolute" 
        style={{ top: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}
        onClick={handleProfileClick}
      >
        <i className="bi bi-person-circle"></i>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>เวลา</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>เวลาในการเล่น: 2 นาที</p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModeSelection;
