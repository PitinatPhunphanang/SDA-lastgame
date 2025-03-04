import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function Leaderboard() {
  const [players, setPlayers] = useState([]); // State สำหรับเก็บข้อมูลผู้เล่น
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลด
  const navigate = useNavigate();
  const handleGoHome = () => navigate('/');



  // // เชื่อมต่อ WebSocket (multiuser ทำ leaderboard แบบ realtime)
  // useEffect(() => {
  //   const ws = new WebSocket('ws://localhost:8080');
  
  //   ws.onopen = () => {
  //     console.log('Connected to WebSocket');
  //   };
  
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('Received data:', data); // ตรวจสอบว่าข้อมูลถูกรับ
  //     if (data.type === 'playerCreated' || data.type === 'playerUpdated') {
  //       // อัปเดต Leaderboard เมื่อมีผู้เล่นใหม่หรืออัปเดต
  //       setPlayers((prevPlayers) => {
  //         const updatedPlayers = prevPlayers.filter((player) => player.id !== data.player.id);
  //         updatedPlayers.push(data.player);
  //         return updatedPlayers.sort((a, b) => b.score - a.score);
  //       });
  //     }
  //   };

  //   return () => {
  //     ws.close();
  //     console.log('Disconnected to WebSocket');
  //   };
  // }, []);

  // ดึงข้อมูลผู้เล่นจาก Strapi
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // เปลี่ยน URL ให้ตรงกับ API ของ Strapi ของคุณ
        const response = await axios.get('http://localhost:1337/api/players'); // ดึงข้อมูลผู้เล่นและภาพ
        console.log(response)
        const sortedPlayers = response.data.data
          .map(player => ({
            ...player,
            score: player.score || 0, // กำหนดค่าเริ่มต้นให้คะแนนเป็น 0 ถ้าไม่มีคะแนน
          }))
          .sort((a, b) => b.score - a.score) // เรียงลำดับจากคะแนนสูงสุดไปต่ำสุด
          .map((player, index) => ({
            ...player,
            rank: index + 1, // เพิ่มลำดับที่ให้กับผู้เล่น
          }));
        setPlayers(sortedPlayers); // กำหนดค่าผลลัพธ์ลงใน state
        setLoading(false); // ปิดสถานะโหลด
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false); // ปิดสถานะโหลด
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: 'url(/777.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-dark text-light p-4 rounded-3"
        style={{ width: '70%', textAlign: 'center' }}
      >
        <h2 className="mb-4" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif' }}>
          กระดานผู้นำ
        </h2>

         {/* Dropdown สำหรับเลือกเวลา (เลือกได้แค่ 2 นาที) */}
         <div className="mb-4">
          <select className="form-select w-50 mx-auto" style={{ fontSize: '1rem' }}>
            <option>เวลา 2:00 นาที</option>
          </select>
        </div>


        {/* ตารางผู้เล่น */}
        {loading ? (
          <div>กำลังโหลดข้อมูล...</div> // แสดงข้อความเมื่อกำลังโหลด
        ) : (
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">ลำดับที่</th>
                <th className="text-center">ชื่อ</th>
                <th className="text-center">คะแนน</th>
                
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'table-light' : 'table-secondary'}
                >
                  <td className="text-center">{player.rank}</td>
                  <td className="text-center">{player.name}</td>
                  <td className="text-center">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ลิงค์ไปหน้าหลัก */}
        <div className="position-absolute" style={{ bottom: '20px', left: '20px', fontSize: '2.5rem', color: 'white', cursor: 'pointer' }} onClick={handleGoHome}>
        <i className="bi bi-house"></i> 
      </div>
      </div>
    </div>
  );
}

export default Leaderboard;