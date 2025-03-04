import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


function Leaderboard() {
  const [players, setPlayers] = useState([]); // State สำหรับเก็บข้อมูลผู้เล่น
  const [loading, setLoading] = useState(true); // ใช้สำหรับแสดงสถานะการโหลด
  const navigate = useNavigate();
  const handleGoHome = () => navigate('/');


  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/players?populate=*');
        console.log(response); // ดูข้อมูลที่มีการ populate ชื่อผู้เล่น
        const sortedPlayers = response.data.data
          .map(player => ({
            ...player,
            score: player.score || 0,
            name: player.user?.username || null, // ดึงชื่อจาก relationship หรือใช้ null หากไม่มีชื่อ
          }))
          .filter(player => player.name !== null) // กรองผู้เล่นที่ไม่มีชื่อ
          .sort((a, b) => b.score - a.score) // เรียงลำดับตามคะแนน
          .map((player, index) => ({
            ...player,
            rank: index + 1, // เพิ่มลำดับให้กับผู้เล่น
          }));
        setPlayers(sortedPlayers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching players:', error);
        setLoading(false);
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