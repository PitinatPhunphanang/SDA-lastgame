import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SinglePlayerGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(location.state?.time * 60 || 0);  // แปลงจากนาทีเป็นวินาที
  const [points, setPoints] = useState(0);  // คะแนน
  const [gameInterval, setGameInterval] = useState(null);  // Interval สำหรับการนับเวลา
  const [gameOver, setGameOver] = useState(false);  // สถานะเกมจบ
  const [showExitModal, setShowExitModal] = useState(false);  // สถานะการแสดง Modal
  const [answer, setAnswer] = useState("");  // คำตอบที่พิมพ์
  const [questionImage, setQuestionImage] = useState("");  // รูปภาพคำถามจาก Strapi
  const [selectedTime, setSelectedTime] = useState(60); // เวลาเริ่มต้น
  const [showTimeDropdown, setShowTimeDropdown] = useState(false); // สถานะแสดง dropdown เลือกเวลา
  const [totalTimeUsed, setTotalTimeUsed] = useState(0); // เวลาทั้งหมดที่ใช้ไป
  const [showTimeSelection, setShowTimeSelection] = useState(false); // สถานะแสดง dropdown เมื่อกดเล่นอีกครั้ง
  const [correctAnswer, setCorrectAnswer] = useState(""); // คำตอบที่ถูกต้องจาก Strapi
  const [hint, setHint] = useState("");  // คำใบ้จาก Strapi
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // คำถามที่เท่าไหร่
  const [totalQuestions, settotalQuestions] = useState(1); // คำถามทั้งหมดที่มี

  // ฟังก์ชันออกจากเกม
  const handleExitGame = () => {
    navigate('/');  // เมื่อกดออกจากเกม จะกลับไปหน้า Home
  };

  const handlePlayagain = () => {
    setShowTimeSelection(true); // แสดง dropdown เลือกเวลา
  };

  // ฟังก์ชันแสดงคำใบ้
  const handleHint = () => {
    alert(`คำใบ้: ${hint}`); // แสดงคำใบ้จาก state
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
        setTotalTimeUsed(prevTotalTimeUsed => prevTotalTimeUsed + 1); // นับเวลาทั้งหมดที่ใช้ไป
      }, 1000);

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
    if (gameOver) {
      // ถ้าเกมจบแล้ว ให้ออกจากเกมทันทีโดยไม่แสดง modal
      handleExitGame();
    } else {
      // ถ้าเกมยังไม่จบ ให้แสดง modal ยืนยัน
      clearInterval(gameInterval);
      setShowExitModal(true);
    }
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

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    setTime(newTime); // ตั้งค่าเวลาใหม่
    setShowTimeSelection(false); // ปิด dropdown หลังจากเลือกเวลา
    setGameOver(false); // รีเซ็ตสถานะเกม
    setPoints(0); // รีเซ็ตคะแนน
    setTotalTimeUsed(0); // รีเซ็ตเวลาทั้งหมดที่ใช้ไป
    setCurrentQuestionIndex(0); // เริ่มที่ข้อแรกใหม่
  };

  // ฟังก์ชันดึงข้อมูลคำถาม
  const fetchQuestionImage = async (index) => {
    try {
      const response = await axios.get("http://localhost:1337/api/games?populate=*");
      const questionData = response.data.data[index]; // ดึงคำถามตาม index
      if (questionData && questionData.img) {
        const imageUrl = `http://localhost:1337${questionData.img.url}`;
        settotalQuestions(response.data.data.length);
        console.log("total",totalQuestions)
        console.log("current",currentQuestionIndex)

        setQuestionImage(imageUrl);
        setCorrectAnswer(questionData.awws); // Set the correct answer
        setHint(questionData.hint); // Set the hint
        console.log("Correct Answer:", questionData.awws); // ตรวจสอบคำตอบที่ดึงมา
        console.log("Hint:", questionData.hint); // ตรวจสอบคำใบ้ที่ดึงมา
      }
    } catch (error) {
      console.error("Error fetching question image:", error);
    }
  };

  // ดึงคำถามแรกเมื่อโหลดหน้า
  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions) {
      clearInterval(gameInterval);
      setGameOver(true);
    } else {
      fetchQuestionImage(currentQuestionIndex);
    }
  }, [currentQuestionIndex]);


  // ฟังก์ชันการพิมพ์คำตอบ
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  // ฟังก์ชันการยืนยันคำตอบ
  const handleSubmitAnswer = () => {
    console.log('User Answer:', answer.trim()); // ตรวจสอบคำตอบที่ผู้เล่นป้อน
    console.log('Correct Answer:', correctAnswer); // ตรวจสอบคำตอบที่ถูกต้องจาก Strapi

    if (answer.trim() === correctAnswer) {  // ตรวจสอบคำตอบ
      alert("คำตอบถูกต้อง!");
      setPoints(points + 10);  // เพิ่มคะแนน
      // ดึงคำถามถัดไป
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // อัปเดต index คำถาม
      setAnswer(""); // เคลียร์ช่องตอบคำถาม
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

      {/* รูปภาพคำถาม */}
      <div className="position-absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        {questionImage ? (
          <img src={questionImage} alt="Question" style={{ width: '600px', height: 'auto', borderRadius: '10px' }} />
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
          style={{ width: '300px', fontSize: '1.2rem' }}
        />
        <button className="btn btn-success mt-2" onClick={handleSubmitAnswer}>ส่งคำตอบ</button>
      </div>

      {/* ส่วนของหมดเวลา */}
      {gameOver ? (
        <div
          className="d-flex flex-column align-items-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '60px 120px',
            borderRadius: '15px',
            color: 'black',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}
        >
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>หมดเวลา</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>เวลาที่ใช้ไป: {formatTime(totalTimeUsed)}</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>คะแนน: {points}</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>คะแนนสูงสุด: </div>

          {/* ปุ่มเล่นอีกครั้งและ dropdown */}
          <div className="d-flex mb-3" style={{ gap: '10px', width: '100%', position: 'relative' }}>
            <button
              className="btn btn-success mt-3"
              style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%' }}
              onClick={handlePlayagain}
            >
              เล่นอีกครั้ง
            </button>

            {showTimeSelection && (
              <div
                className="dropdown-menu show"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  minWidth: '120px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  padding: '10px',
                  marginTop: '10px' // เพิ่มระยะห่างจากปุ่ม
                }}
              >
                <button
                  className="dropdown-item"
                  style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }}
                  onClick={() => handleTimeChange(60)}
                >
                  1 นาที
                </button>
                <button
                  className="dropdown-item"
                  style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }}
                  onClick={() => handleTimeChange(300)}
                >
                  5 นาที
                </button>
                <button
                  className="dropdown-item"
                  style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }}
                  onClick={() => handleTimeChange(600)}
                >
                  10 นาที
                </button>
              </div>
            )}
          </div>

          {/* ปุ่มกลับสู่หน้าหลัก */}
          <button
            className="btn btn-danger mt-3"
            style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%' }}
            onClick={handleExitGame}
          >
            กลับหน้าหลัก
          </button>
        </div>
      ) : null}

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
