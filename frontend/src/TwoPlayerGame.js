import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import conf from './conf/main';

function TwoPlayerGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(location.state?.time * 60 || 0);
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const [gameInterval, setGameInterval] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [questionImage, setQuestionImage] = useState("");

  const handleExitGame = () => {
    navigate('/');
  };

  const handleHint = () => {
    alert('คำใบ้: คิดดีๆครับพี่');
  };

  useEffect(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }

    if (time > 0) {
      const interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setGameOver(true);
          }
          return prevTime - 1;
        });
      }, 1000);

      setGameInterval(interval);

      return () => clearInterval(interval);
    }
  }, [time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleShowExitModal = () => {
    clearInterval(gameInterval);
    setShowExitModal(true);
  };

  const handleContinueGame = () => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setGameOver(true);
        }
        return prevTime - 1;
      });
    }, 1000);

    setGameInterval(interval);
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigate('/');
  };

  useEffect(() => {
    const fetchQuestionImage = async () => {
      try {
        const response = await axios.get(`${conf.apiUrlPrefix}/questions?populate=image`);
        const questionData = response.data.data[0];
        if (questionData && questionData.image) {
          setQuestionImage(`${conf.apiUrlPrefix}${questionData.image.url}`);
        }
      } catch (error) {
        console.error("Error fetching question image:", error);
      }
    };

    fetchQuestionImage();
  }, []);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (answer.trim() === "correct answer") {
      alert("คำตอบถูกต้อง!");
      setPlayer1Points(player1Points + 10);
    } else {
      alert("คำตอบไม่ถูกต้อง");
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
      {/* เวลา */}
      <div className="position-absolute" style={{ top: '20px', left: '20px', fontSize: '1.2rem', color: 'white' }}>
        <div>เวลา {formatTime(time)} นาที</div>
      </div>

      {/* โปรไฟล์ผู้เล่น 1 */}
      <div className="position-absolute" style={{ top: '20px', right: '200px', textAlign: 'center' }}>
        <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
        <div style={{ fontSize: '1rem', color: 'white', marginTop: '5px' }}>คุณ: {player1Points} คะแนน</div>
      </div>

      {/* คำว่า "VS" */}
      <div className="position-absolute" style={{ top: '35px', right: '150px', fontSize: '1.5rem', color: 'red', fontWeight: 'bold' }}>
        VS
      </div>

      {/* โปรไฟล์ผู้เล่น 2 */}
      <div className="position-absolute" style={{ top: '20px', right: '20px', textAlign: 'center' }}>
        <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
        <div style={{ fontSize: '1rem', color: 'white', marginTop: '5px' }}>ผู้เล่น2: {player2Points} คะแนน</div>
      </div>

      {/* ไอคอนออกเกม */}
      <div
        className="position-absolute"
        style={{ bottom: '20px', left: '20px', fontSize: '2rem', color: 'white', cursor: 'pointer' }}
        onClick={handleShowExitModal}
      >
        <i className="bi bi-door-open"></i>
      </div>

      {/* ไอคอนคำใบ้ */}
      <div
        className="position-absolute"
        style={{ bottom: '20px', right: '20px', fontSize: '2rem', color: 'white', cursor: 'pointer' }}
        onClick={handleHint}
      >
        <i className="bi bi-lightbulb"></i>
      </div>

      {/* รูปภาพคำถาม */}
      <div className="position-absolute" style={{ top: '40%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        {questionImage ? (
          <img src={questionImage} alt="Question" style={{ width: '200px', height: 'auto', borderRadius: '10px' }} />
        ) : (
          <div>กำลังโหลดภาพ...</div>
        )}
      </div>

      {/* ช่องกรอกคำตอบ */}
      <div className="position-absolute" style={{ bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>
        <input
          type="text"
          value={answer}
          onChange={handleAnswerChange}
          className="form-control"
          placeholder="พิมพ์คำตอบของคุณ..."
          style={{ width: '300px', fontSize: '1rem' }}
        />
        <button className="btn btn-success mt-2" onClick={handleSubmitAnswer}>ส่งคำตอบ</button>
      </div>

      {/* เกมกลาง */}
      <div className="d-flex justify-content-center align-items-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2rem', color: 'white' }}>
        <div>
          {gameOver ? (
            <div>
              <h3>หมดเวลา!</h3>
              <div>คะแนน: {player1Points}</div>
              <button className="btn btn-danger mt-3" onClick={handleExitGame}>ออกจากเกม</button>
            </div>
          ) : null}
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

export default TwoPlayerGame;