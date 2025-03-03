import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SinglePlayerGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(location.state?.time * 60 || 0);
  const [points, setPoints] = useState(0);
  const [gameInterval, setGameInterval] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [selectedTime, setSelectedTime] = useState(60);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(1);
  const [userName, setUserName] = useState(""); // สร้าง state สำหรับเก็บ username

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก token
  const getUserDetails = async () => {
    const token = sessionStorage.getItem("authToken"); // ดึง token จาก sessionStorage
    if (token) {
      try {
        const response = await axios.get("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`, // ใส่ Token ใน header
          },
        });
        console.log("User Details:", response.data);
        setUserName(response.data.username); // เก็บ username ใน state
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      console.log("No token found, user is not authenticated.");
    }
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลผู้ใช้เมื่อ component mount
  useEffect(() => {
    getUserDetails(); // ดึงข้อมูลผู้ใช้เมื่อ component ถูก mount
  }, []);

  const submitScore = async (finalPoints) => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("คุณต้องล็อคอินก่อนที่จะบันทึกคะแนน");
      return;
    }

    try {
      // เรียกข้อมูลผู้ใช้ที่ล็อกอิน
      const response = await axios.get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ใน headers
        },
      });

      // ส่งข้อมูลคะแนนพร้อมกับ userId ไปยัง API
      const userId = response.data.id; // ดึง userId จาก response
      const scoreResponse = await axios.post("http://localhost:1337/api/players", {
        data: {
          score: finalPoints,
          user: userId,  // ส่ง userId ไปในข้อมูล
        },
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ใน headers
        },
      });

      console.log('Score posted:', scoreResponse.data);
    } catch (error) {
      console.error('Error posting score:', error);
    }
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
            setGameOver(true);
          }
          return prevTime - 1;
        });
        setTotalTimeUsed(prevTotalTimeUsed => prevTotalTimeUsed + 1);
      }, 1000);

      setGameInterval(interval);

      return () => clearInterval(interval);
    }
  }, [time]);

  // ฟังก์ชันออกจากเกม
  const handleExitGame = () => {
    navigate('/');
  };

  const handlePlayagain = () => {
    setShowTimeSelection(true);
  };

  const handleHint = () => {
    alert(`คำใบ้: ${hint}`);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleShowExitModal = () => {
    if (gameOver) {
      handleExitGame();
    } else {
      clearInterval(gameInterval);
      setShowExitModal(true);
    }
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

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    setTime(newTime);
    setShowTimeSelection(false);
    setGameOver(false);
    setPoints(0);
    setTotalTimeUsed(0);
    setCurrentQuestionIndex(0);
  };

  const fetchQuestionImage = async (index) => {
    try {
      const response = await axios.get("http://localhost:1337/api/games?populate=*");
      const questionData = response.data.data[index];
      if (questionData && questionData.img) {
        const imageUrl = `http://localhost:1337${questionData.img.url}`;
        setTotalQuestions(response.data.data.length);
        console.log("total", totalQuestions);
        console.log("current", currentQuestionIndex);
        setQuestionImage(imageUrl);
        setCorrectAnswer(questionData.awws);
        setHint(questionData.hint);
        console.log("Correct Answer:", questionData.awws);
        console.log("Hint:", questionData.hint);
      }
    } catch (error) {
      console.error("Error fetching question image:", error);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions) {
      clearInterval(gameInterval);
      setGameOver(true);
    } else {
      fetchQuestionImage(currentQuestionIndex);
    }
  }, [currentQuestionIndex]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    console.log('User Answer:', answer.trim());
    console.log('Correct Answer:', correctAnswer);
    if (answer.trim() === correctAnswer) {
      alert("คำตอบถูกต้อง!");
      setPoints(points + 10);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswer("");
    } else {
      alert("คำตอบไม่ถูกต้อง");
    }
  };

  useEffect(() => {
    if (gameOver) {
      const token = sessionStorage.getItem("authToken"); // ตรวจสอบ token
      if (token) {
        submitScore(points); // ส่งคะแนนไปที่ API เมื่อเกมจบ
      }
    }
  }, [gameOver, points]); // เพิ่ม dependencies ใน useEffect เพื่อให้ทำงานเมื่อคะแนนหรือ gameOver เปลี่ยนแปลง

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
        <i className="bi bi-door-open"></i>
      </div>

      {/* ไอคอนคำใบ้ */}
      <div
        className="position-absolute"
        style={{ bottom: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }}
        onClick={handleHint}
      >
        <i className="bi bi-lightbulb"></i>
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
                  marginTop: '10px'
                }}
              >
                <button className="dropdown-item" style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }} onClick={() => handleTimeChange(60)}>
                  1 นาที
                </button>
                <button className="dropdown-item" style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }} onClick={() => handleTimeChange(300)}>
                  5 นาที
                </button>
                <button className="dropdown-item" style={{ fontSize: '1.1rem', padding: '8px 12px', borderRadius: '5px' }} onClick={() => handleTimeChange(600)}>
                  10 นาที
                </button>
              </div>
            )}
          </div>

          <button
            className="btn btn-danger mt-3"
            style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%' }}
            onClick={handleExitGame}
          >
            กลับหน้าหลัก
          </button>
        </div>
      ) : null}

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
