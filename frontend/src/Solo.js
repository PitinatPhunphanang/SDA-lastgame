import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import conf from './conf/main';

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
  const [hintCount, setHintCount] = useState(3); // เริ่มต้นมี 3 คำใบ้
  const [displayedHint, setDisplayedHint] = useState(""); // สำหรับแสดงคำใบ้
  const [userName, setUserName] = useState(""); // สร้าง state สำหรับเก็บ username
  const [resultMessage, setResultMessage] = useState(""); // เพิ่ม state สำหรับเก็บข้อความผลลัพธ์

  // ฟังก์ชันแสดงข้อความชั่วคราว
  const showResultMessage = (message) => {
    setResultMessage(message);
    setTimeout(() => {
      setResultMessage("");
    }, 3000); // ข้อความจะหายไปหลังจาก 3 วินาที
  };

  // ฟังก์ชันดึงข้อมูลผู้ใช้จาก token
  const getUserDetails = async () => {
    const token = sessionStorage.getItem("authToken"); // ดึง token จาก sessionStorage
    if (token) {
      try {
        const response = await axios.get(`${conf.apiUrlPrefix}/users/me`, {
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
      const response = await axios.get(`${conf.apiUrlPrefix}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ใน headers
        },
      });

      // ส่งข้อมูลคะแนนพร้อมกับ userId ไปยัง API
      const userId = response.data.id; // ดึง userId จาก response
      const scoreResponse = await axios.post(`${conf.apiUrlPrefix}/players`, {
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

  useEffect(() => {
    if (currentQuestionIndex >= totalQuestions) {
      clearInterval(gameInterval);
      setGameOver(true);
    } else {
      fetchQuestionImage(currentQuestionIndex);
      setDisplayedHint(""); // รีเซ็ตคำใบ้เมื่อเปลี่ยนคำถาม
    }
  }, [currentQuestionIndex]);
  

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
    if (hintCount > 0) {
      setDisplayedHint(`คำใบ้: ${hint}`);
      setHintCount(hintCount - 1);
    } else {
      setDisplayedHint("คุณใช้คำใบ้หมดแล้ว");
    }
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
    setDisplayedHint(""); // เคลียร์คำใบ้เมื่อเริ่มเกมใหม่
    setHintCount(3); // รีเซ็ตคำใบ้เป็น 3
  };


  // ฟังก์ชันดึงข้อมูลคำถาม
  const fetchQuestionImage = async (index) => {
    try {
      const response = await axios.get(`${conf.apiUrlPrefix}/games?populate=*`);
      const questionData = response.data.data[index];
      if (questionData && questionData.img) {
        const imageUrl = `${conf.apiUrlPrefix}${questionData.img.url}`;
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

  // ใช้ Promise.all เพื่อให้ดึงข้อมูลทั้งสอง (ข้อมูลผู้ใช้ และคำถาม) พร้อมกัน
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        const userDetails = axios.get(`${conf.apiUrlPrefix}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const questionDetails = axios.get(`${conf.apiUrlPrefix}/games?populate=*`);

        try {
          const [userResponse, questionResponse] = await Promise.all([userDetails, questionDetails]);
          console.log("User Details:", userResponse.data);
          console.log("Question Details:", questionResponse.data);
          setUserName(userResponse.data.username);
          setTotalQuestions(questionResponse.data.data.length);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    console.log('User Answer:', answer.trim());
    console.log('Correct Answer:', correctAnswer);
    if (answer.trim() === correctAnswer) {
      showResultMessage("คำตอบถูกต้อง!"); // แสดงข้อความแทนการใช้ alert
      setPoints(points + 10);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswer("");
    } else {
      showResultMessage("คำตอบไม่ถูกต้อง"); // แสดงข้อความแทนการใช้ alert
    }
  };

  // ส่วนแสดงผลข้อความผลลัพธ์
  const renderResultMessage = () => {
    if (resultMessage) {
      return (
        <div
          style={{
            position: 'fixed',
            top: '2.5%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: resultMessage === "คำตอบถูกต้อง!" ? 'green' : 'red',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            fontSize: '1.2rem',
            textAlign: 'center',
          }}
        >
          {resultMessage}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (gameOver) {
      const token = sessionStorage.getItem("authToken"); // ตรวจสอบ token
      if (token) {
        submitScore(points); // ส่งคะแนนไปที่ API เมื่อเกมจบ
      }
    }
  }, [gameOver, points]);

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
        className="position-absolute d-flex align-items-center"
        style={{ bottom: '20px', right: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer', position: 'relative' }}
        onClick={handleHint}
      >
        <i className="bi bi-lightbulb"></i>
        {hintCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              width: '25px',
              height: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {hintCount}
          </span>
        )}
      </div>

      {/* รูปภาพคำถามและคำใบ้ */}
      <div className="position-absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        {questionImage ? (
          <img src={questionImage} alt="Question" style={{ width: '600px', height: 'auto', borderRadius: '10px' }} />
        ) : (
          <div>กำลังโหลดภาพ...</div>
        )}
        {/* แสดงคำใบ้ด้านล่างภาพคำถาม */}
        {displayedHint && (
          <div style={{ 
            marginTop: '20px', 
            fontSize: '1.2rem', 
            color: 'black', 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            padding: '10px', 
            borderRadius: '5px',
            width: '600px',
            textAlign: 'center'
          }}>
            {displayedHint}
          </div>
        )}
      </div>

      {/* ช่องกรอกคำตอบและปุ่มส่ง */}
      <div 
        className="position-absolute" 
        style={{ 
          top: displayedHint ? '75%' : '70%', // ขยับลงมาเมื่อมีคำใบ้
          left: '50%', 
          transform: 'translateX(-50%)', 
          transition: 'top 0.3s ease' // เพิ่ม animation ให้การขยับ
        }}
      >
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

      {/* แสดงข้อความผลลัพธ์ */}
      {renderResultMessage()}

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
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>หมดเวลา!</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>เวลาที่ใช้ไป: {formatTime(totalTimeUsed)}</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>คะแนน: {points}</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>คะแนนสูงสุด: </div>

          <div className="d-flex mb-3" style={{ gap: '10px', width: '100%', position: 'relative' }}>
          <button
        className="btn btn-success mt-3"
        style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%' }}
        onClick={() => {
          setTime(120); // บังคับเวลาเป็น 2 นาที (120 วินาที)
          setGameOver(false);
          setPoints(0);
          setTotalTimeUsed(0);
          setCurrentQuestionIndex(0);
          setDisplayedHint(""); // เคลียร์คำใบ้เมื่อเริ่มเกมใหม่
          setHintCount(3); // รีเซ็ตคำใบ้เป็น 3
        }}
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
